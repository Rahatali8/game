"""Seed initial products and admin user."""
import asyncio
from decimal import Decimal
from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.wallet import Wallet
from app.models.product import Product
from app.models import miner, commission, transaction, message, login_history, notification, announcement, task_reward, bonus, claim_history  # noqa: F401 - needed for SQLAlchemy relationship resolution
from app.utils.helpers import generate_referral_code

PRODUCTS = [
    {"name": "Cloud-Sky Micro BT", "price": Decimal("5"), "old_price": Decimal("8"), "daily_income": Decimal("0.40"), "total_income": Decimal("10.00"), "period_days": 25, "quantity_limit": 1, "country": "global", "offer_tag": "SPECIAL PRICE | BIG DISCOUNT", "sort_order": 1},
    {"name": "Cloud-Sky Starter", "price": Decimal("20"), "old_price": Decimal("30"), "daily_income": Decimal("1.20"), "total_income": Decimal("36.00"), "period_days": 30, "quantity_limit": 2, "country": "global", "offer_tag": "POPULAR", "sort_order": 2},
    {"name": "Cloud-Sky Pro", "price": Decimal("50"), "old_price": Decimal("70"), "daily_income": Decimal("3.50"), "total_income": Decimal("105.00"), "period_days": 30, "quantity_limit": 2, "country": "global", "offer_tag": "HOT DEAL", "sort_order": 3},
    {"name": "Kazakhstan Miner", "price": Decimal("100"), "daily_income": Decimal("8.00"), "total_income": Decimal("240.00"), "period_days": 30, "quantity_limit": 3, "country": "Kazakhstan", "sort_order": 4},
    {"name": "Iceland Green Miner", "price": Decimal("200"), "daily_income": Decimal("18.00"), "total_income": Decimal("540.00"), "period_days": 30, "quantity_limit": 2, "country": "Iceland", "sort_order": 5},
    {"name": "Japan Premium Rig", "price": Decimal("300"), "daily_income": Decimal("28.00"), "total_income": Decimal("840.00"), "period_days": 30, "quantity_limit": 1, "country": "Japan", "sort_order": 6},
    {"name": "China Ultra Miner", "price": Decimal("500"), "daily_income": Decimal("50.00"), "total_income": Decimal("1500.00"), "period_days": 30, "quantity_limit": 1, "country": "China", "sort_order": 7},
    {"name": "North Korea Special", "price": Decimal("1000"), "daily_income": Decimal("110.00"), "total_income": Decimal("3300.00"), "period_days": 30, "quantity_limit": 1, "country": "North Korea", "sort_order": 8},
    {"name": "PREMIUM MEMBER UPGRADE", "price": Decimal("80"), "daily_income": Decimal("0"), "total_income": Decimal("0"), "period_days": 365, "quantity_limit": 1, "country": "global", "is_premium_miner": True, "offer_tag": "UNLOCK ALL BENEFITS", "card_color": "gold", "sort_order": 0},
]


async def seed():
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select

        for p_data in PRODUCTS:
            result = await db.execute(select(Product).where(Product.name == p_data["name"]))
            if not result.scalar_one_or_none():
                product = Product(**p_data)
                db.add(product)
                print(f"Added product: {p_data['name']}")

        admin_result = await db.execute(select(User).where(User.mobile == "admin"))
        if not admin_result.scalar_one_or_none():
            admin = User(
                mobile="admin",
                password_hash=hash_password("admin123"),
                name="Admin",
                referral_code="ADMIN0",
                is_admin=True,
            )
            db.add(admin)
            await db.flush()
            wallet = Wallet(user_id=admin.id)
            db.add(wallet)
            print("Created admin user (mobile: admin, password: admin123)")

        await db.commit()
        print("Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed())
