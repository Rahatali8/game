from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.common import ok
from app.services.wallet_service import get_wallet, get_dashboard

router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("")
async def wallet(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    w = await get_wallet(db, current_user.id)
    return ok(data={
        "balance": float(w.balance),
        "commission_income": float(w.commission_income),
        "total_withdrawn": float(w.total_withdrawn),
        "total_earned": float(w.total_earned),
    })


@router.get("/dashboard")
async def dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.models.miner import UserMiner
    from sqlalchemy import select, func

    data = await get_dashboard(db, current_user.id)
    miners_result = await db.execute(
        select(func.count(UserMiner.id))
        .where(UserMiner.user_id == current_user.id, UserMiner.status == "active")
    )
    miners_count = miners_result.scalar() or 0

    w = data["wallet"]
    return ok(data={
        "wallet": {
            "balance": float(w.balance),
            "commission_income": float(w.commission_income),
            "total_withdrawn": float(w.total_withdrawn),
            "total_earned": float(w.total_earned),
        },
        "miners_count": miners_count,
        "today_mining": float(data["today_mining"]),
        "yesterday_mining": float(data["yesterday_mining"]),
        "total_referrals": data["total_referrals"],
    })
