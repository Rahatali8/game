from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from datetime import datetime, timezone, date
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.task_reward import TaskReward
from app.schemas.common import ok
from app.services.wallet_service import get_wallet

router = APIRouter(prefix="/tasks", tags=["tasks"])

DAILY_REWARD_AMOUNT = Decimal("0.10")


@router.get("/reward")
async def task_reward_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()
    result = await db.execute(
        select(TaskReward).where(
            TaskReward.user_id == current_user.id,
            TaskReward.task_type == "daily_signin",
            TaskReward.claimed_date == today,
        )
    )
    claimed = result.scalar_one_or_none()
    return ok(data={"claimed_today": claimed is not None, "amount": float(DAILY_REWARD_AMOUNT)})


@router.post("/claim-daily")
async def claim_daily(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()
    result = await db.execute(
        select(TaskReward).where(
            TaskReward.user_id == current_user.id,
            TaskReward.task_type == "daily_signin",
            TaskReward.claimed_date == today,
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already claimed today's reward")

    reward = TaskReward(
        user_id=current_user.id,
        task_type="daily_signin",
        amount=DAILY_REWARD_AMOUNT,
        claimed_date=today,
    )
    db.add(reward)

    wallet = await get_wallet(db, current_user.id)
    wallet.balance += DAILY_REWARD_AMOUNT
    wallet.total_earned += DAILY_REWARD_AMOUNT

    await db.commit()
    return ok(data={"amount": float(DAILY_REWARD_AMOUNT)}, message=f"Claimed ${DAILY_REWARD_AMOUNT} daily reward")
