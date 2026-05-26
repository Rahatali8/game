from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal
from datetime import datetime, timezone, timedelta
from app.models.wallet import Wallet
from app.models.claim_history import ClaimHistory
from app.models.user import User


async def get_wallet(db: AsyncSession, user_id: int) -> Wallet:
    result = await db.execute(select(Wallet).where(Wallet.user_id == user_id))
    wallet = result.scalar_one_or_none()
    if not wallet:
        wallet = Wallet(user_id=user_id)
        db.add(wallet)
        await db.flush()
    return wallet


async def get_dashboard(db: AsyncSession, user_id: int) -> dict:
    wallet = await get_wallet(db, user_id)

    today = datetime.now(timezone.utc).date()
    yesterday = today - timedelta(days=1)

    today_result = await db.execute(
        select(func.coalesce(func.sum(ClaimHistory.amount), 0))
        .where(ClaimHistory.user_id == user_id)
        .where(func.date(ClaimHistory.claimed_at) == today)
    )
    today_mining = today_result.scalar() or Decimal("0.00")

    yesterday_result = await db.execute(
        select(func.coalesce(func.sum(ClaimHistory.amount), 0))
        .where(ClaimHistory.user_id == user_id)
        .where(func.date(ClaimHistory.claimed_at) == yesterday)
    )
    yesterday_mining = yesterday_result.scalar() or Decimal("0.00")

    referral_result = await db.execute(
        select(func.count(User.id)).where(User.referred_by == (
            select(User.referral_code).where(User.id == user_id).scalar_subquery()
        ))
    )
    total_referrals = referral_result.scalar() or 0

    return {
        "wallet": wallet,
        "today_mining": today_mining,
        "yesterday_mining": yesterday_mining,
        "total_referrals": total_referrals,
    }
