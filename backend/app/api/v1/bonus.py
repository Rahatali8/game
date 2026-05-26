from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.bonus import BonusCode, BonusClaim
from app.schemas.common import ok
from app.services.wallet_service import get_wallet

router = APIRouter(prefix="/bonus", tags=["bonus"])


@router.post("/redeem-code")
async def redeem_bonus(
    body: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    code_str = (body.get("code") or "").strip().upper()
    if not code_str:
        raise HTTPException(status_code=400, detail="Code is required")

    result = await db.execute(
        select(BonusCode).where(BonusCode.code == code_str, BonusCode.is_active == True)
    )
    bonus_code = result.scalar_one_or_none()
    if not bonus_code:
        raise HTTPException(status_code=404, detail="Invalid or expired bonus code")

    now = datetime.now(timezone.utc)
    if bonus_code.expires_at and bonus_code.expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=400, detail="Bonus code expired")

    if bonus_code.uses_count >= bonus_code.max_uses:
        raise HTTPException(status_code=400, detail="Bonus code has reached maximum uses")

    already = await db.execute(
        select(BonusClaim).where(BonusClaim.user_id == current_user.id, BonusClaim.bonus_code == code_str)
    )
    if already.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You have already used this code")

    bonus_code.uses_count += 1
    claim = BonusClaim(user_id=current_user.id, bonus_code=code_str, amount=bonus_code.amount)
    db.add(claim)

    wallet = await get_wallet(db, current_user.id)
    wallet.balance += bonus_code.amount
    wallet.total_earned += bonus_code.amount

    await db.commit()
    return ok(data={"amount": float(bonus_code.amount)}, message=f"Bonus of ${bonus_code.amount} added to your balance")
