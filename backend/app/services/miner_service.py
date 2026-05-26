from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import HTTPException, status
from decimal import Decimal
from datetime import datetime, timezone, timedelta
from app.models.user import User
from app.models.product import Product
from app.models.miner import UserMiner
from app.models.claim_history import ClaimHistory
from app.services.wallet_service import get_wallet
from app.services.commission_service import distribute_commission


def _miner_out(miner: UserMiner) -> dict:
    now = datetime.now(timezone.utc)
    last_claim = miner.last_claim_at
    if last_claim and last_claim.tzinfo is None:
        last_claim = last_claim.replace(tzinfo=timezone.utc)

    cooldown_passed = last_claim is None or (now - last_claim).total_seconds() >= 86400
    can_claim = miner.status == "active" and cooldown_passed

    if last_claim and not cooldown_passed:
        next_claim = last_claim + timedelta(hours=24)
        remaining_cooldown = max(0, int((next_claim - now).total_seconds()))
    else:
        remaining_cooldown = 0

    remaining_days = miner.period_days - miner.days_claimed

    return {
        "id": miner.id,
        "product_name": miner.product_name,
        "image_url": miner.image_url,
        "daily_income": miner.daily_income,
        "total_income": miner.total_income,
        "period_days": miner.period_days,
        "days_claimed": miner.days_claimed,
        "last_claim_at": miner.last_claim_at,
        "expires_at": miner.expires_at,
        "status": miner.status,
        "can_claim": can_claim,
        "remaining_cooldown": remaining_cooldown,
        "remaining_days": max(0, remaining_days),
    }


async def get_user_miners(db: AsyncSession, user_id: int) -> list[dict]:
    result = await db.execute(
        select(UserMiner).where(UserMiner.user_id == user_id).order_by(UserMiner.id.desc())
    )
    miners = result.scalars().all()
    return [_miner_out(m) for m in miners]


async def purchase_miner(db: AsyncSession, user: User, product_id: int) -> UserMiner:
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.is_active == True)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = await db.execute(
        select(UserMiner).where(
            UserMiner.user_id == user.id,
            UserMiner.product_id == product_id,
            UserMiner.status == "active",
        )
    )
    count = len(existing.scalars().all())
    if count >= product.quantity_limit:
        raise HTTPException(status_code=400, detail="Purchase limit reached for this product")

    wallet = await get_wallet(db, user.id)
    total_available = wallet.balance + wallet.commission_income
    if total_available < product.price:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    price = product.price
    if wallet.balance >= price:
        wallet.balance -= price
    else:
        from_commission = price - wallet.balance
        wallet.balance = Decimal("0.00")
        wallet.commission_income -= from_commission

    now = datetime.now(timezone.utc)
    miner = UserMiner(
        user_id=user.id,
        product_id=product.id,
        product_name=product.name,
        image_url=product.image_url,
        purchase_price=product.price,
        daily_income=product.daily_income,
        total_income=product.total_income,
        period_days=product.period_days,
        started_at=now,
        expires_at=now + timedelta(days=product.period_days),
        status="active",
    )
    db.add(miner)
    await db.flush()

    await distribute_commission(db, user, miner, product.price)

    if product.is_premium_miner:
        user.is_premium = True
        user.premium_until = miner.expires_at

    await db.commit()
    await db.refresh(miner)
    return miner


async def claim_miner(db: AsyncSession, user_id: int, miner_id: int) -> Decimal:
    result = await db.execute(
        select(UserMiner).where(UserMiner.id == miner_id, UserMiner.user_id == user_id)
    )
    miner = result.scalar_one_or_none()
    if not miner:
        raise HTTPException(status_code=404, detail="Miner not found")

    now = datetime.now(timezone.utc)
    last_claim = miner.last_claim_at
    if last_claim and last_claim.tzinfo is None:
        last_claim = last_claim.replace(tzinfo=timezone.utc)

    if last_claim and (now - last_claim).total_seconds() < 86400:
        raise HTTPException(status_code=400, detail="Claim available once every 24 hours")

    if miner.status != "active":
        raise HTTPException(status_code=400, detail="Miner is not active")

    miner.last_claim_at = now
    miner.days_claimed += 1

    if miner.days_claimed >= miner.period_days:
        miner.status = "expired"

    wallet = await get_wallet(db, user_id)
    wallet.balance += miner.daily_income
    wallet.total_earned += miner.daily_income

    claim = ClaimHistory(user_id=user_id, miner_id=miner.id, amount=miner.daily_income)
    db.add(claim)
    await db.commit()
    return miner.daily_income


async def claim_all_miners(db: AsyncSession, user_id: int) -> Decimal:
    result = await db.execute(
        select(UserMiner).where(UserMiner.user_id == user_id, UserMiner.status == "active")
    )
    miners = result.scalars().all()

    now = datetime.now(timezone.utc)
    total = Decimal("0.00")

    for miner in miners:
        last_claim = miner.last_claim_at
        if last_claim and last_claim.tzinfo is None:
            last_claim = last_claim.replace(tzinfo=timezone.utc)

        if last_claim and (now - last_claim).total_seconds() < 86400:
            continue

        miner.last_claim_at = now
        miner.days_claimed += 1
        if miner.days_claimed >= miner.period_days:
            miner.status = "expired"

        total += miner.daily_income
        claim = ClaimHistory(user_id=user_id, miner_id=miner.id, amount=miner.daily_income)
        db.add(claim)

    if total > 0:
        wallet = await get_wallet(db, user_id)
        wallet.balance += total
        wallet.total_earned += total

    await db.commit()
    return total
