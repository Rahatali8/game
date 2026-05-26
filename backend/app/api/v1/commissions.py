from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.commission import Commission, CommissionClaim
from app.schemas.commission import CommissionOut, CommissionTotals
from app.schemas.common import ok
from app.services.wallet_service import get_wallet

router = APIRouter(prefix="/commissions", tags=["commissions"])


@router.get("/history")
async def commission_history(
    limit: int = Query(30, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Commission)
        .where(Commission.user_id == current_user.id)
        .order_by(Commission.created_at.desc())
        .limit(limit)
    )
    commissions = result.scalars().all()
    return ok(data=[CommissionOut.model_validate(c) for c in commissions])


@router.get("/totals")
async def commission_totals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for level in [1, 2, 3]:
        result = await db.execute(
            select(func.coalesce(func.sum(Commission.commission_amount), 0))
            .where(Commission.user_id == current_user.id, Commission.level == level)
        )
        globals()[f"l{level}"] = result.scalar() or Decimal("0.00")

    total = l1 + l2 + l3
    return ok(data=CommissionTotals(total=total, level1=l1, level2=l2, level3=l3))


@router.post("/claim")
async def claim_commission(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from fastapi import HTTPException
    wallet = await get_wallet(db, current_user.id)
    amount = wallet.commission_income
    if amount <= 0:
        raise HTTPException(status_code=400, detail="No commission to claim")

    wallet.balance += amount
    wallet.commission_income = Decimal("0.00")

    claim = CommissionClaim(user_id=current_user.id, amount=amount)
    db.add(claim)
    await db.commit()
    return ok(data={"claimed": float(amount)}, message=f"Claimed ${amount:.2f} commission")
