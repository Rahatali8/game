from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from app.models.user import User
from app.models.wallet import Wallet
from app.models.commission import Commission
from app.models.miner import UserMiner
from app.services.wallet_service import get_wallet


async def distribute_commission(
    db: AsyncSession,
    buyer: User,
    miner: UserMiner,
    purchase_amount: Decimal,
) -> None:
    levels = [(1, Decimal("10")), (2, Decimal("4")), (3, Decimal("2"))]
    current_referrer_code = buyer.referred_by

    for level, percent in levels:
        if not current_referrer_code:
            break

        result = await db.execute(
            select(User).where(User.referral_code == current_referrer_code, User.is_active == True)
        )
        upline = result.scalar_one_or_none()
        if not upline:
            break

        amount = (purchase_amount * percent / Decimal("100")).quantize(Decimal("0.01"))

        commission = Commission(
            user_id=upline.id,
            from_user_id=buyer.id,
            from_user_name=buyer.name or buyer.mobile,
            miner_id=miner.id,
            miner_name=miner.product_name,
            level=level,
            commission_percent=percent,
            purchase_amount=purchase_amount,
            commission_amount=amount,
        )
        db.add(commission)

        wallet = await get_wallet(db, upline.id)
        wallet.commission_income += amount
        wallet.total_earned += amount

        current_referrer_code = upline.referred_by
