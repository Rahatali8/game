from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
import json
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import verify_password
from app.models.user import User
from app.models.transaction import Withdrawal
from app.schemas.transaction import WithdrawRequest, WithdrawalOut
from app.schemas.common import ok
from app.services.wallet_service import get_wallet

router = APIRouter(prefix="/withdrawals", tags=["withdrawals"])

FEE_PERCENT = Decimal("0")  # 0% fee, adjust as needed
MIN_WITHDRAW = Decimal("10")


@router.post("")
async def create_withdrawal(
    body: WithdrawRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.amount < MIN_WITHDRAW:
        raise HTTPException(status_code=400, detail=f"Minimum withdrawal is ${MIN_WITHDRAW}")

    if not current_user.withdraw_pin:
        raise HTTPException(status_code=400, detail="Withdraw PIN not set. Please set it first.")

    if not verify_password(body.withdraw_pin, current_user.withdraw_pin):
        raise HTTPException(status_code=400, detail="Incorrect withdraw PIN")

    wallet = await get_wallet(db, current_user.id)
    if wallet.balance < body.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    fee = (body.amount * FEE_PERCENT / Decimal("100")).quantize(Decimal("0.01"))
    net = body.amount - fee

    wallet.balance -= body.amount
    wallet.total_withdrawn += net

    withdrawal = Withdrawal(
        user_id=current_user.id,
        amount=body.amount,
        fee=fee,
        net_amount=net,
        method=body.method,
        account_details=json.dumps(body.account_details),
        status="pending",
    )
    db.add(withdrawal)
    await db.commit()
    await db.refresh(withdrawal)
    return ok(data=WithdrawalOut.model_validate(withdrawal), message="Withdrawal request submitted")


@router.get("/history")
async def withdrawal_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Withdrawal).where(Withdrawal.user_id == current_user.id).order_by(Withdrawal.requested_at.desc()).limit(50)
    )
    return ok(data=[WithdrawalOut.model_validate(w) for w in result.scalars().all()])
