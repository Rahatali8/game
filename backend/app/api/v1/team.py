from fastapi import APIRouter, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.common import ok

router = APIRouter(prefix="/team", tags=["team"])

WEEKLY_BONUS_TIERS = [
    (5000, "Consultant", Decimal("15000")),
    (2500, "Corporate Partner", Decimal("1000")),
    (1300, "Executive Partner", Decimal("100")),
    (500, "City Partner", Decimal("30")),
    (200, "Regional Partner", Decimal("15")),
    (100, "Senior Partner", Decimal("10")),
    (50, "Intermediate Partner", Decimal("5")),
    (30, "Junior Partner", Decimal("2")),
    (0, "New Partner", Decimal("0")),
]


def get_tier(l1_count: int) -> tuple[str, Decimal]:
    for threshold, name, bonus in WEEKLY_BONUS_TIERS:
        if l1_count >= threshold:
            return name, bonus
    return "New Partner", Decimal("0")


async def get_level_users(db: AsyncSession, referral_code: str) -> list[User]:
    result = await db.execute(select(User).where(User.referred_by == referral_code, User.is_active == True))
    return result.scalars().all()


@router.get("/stats")
async def team_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    l1_users = await get_level_users(db, current_user.referral_code)
    l1_count = len(l1_users)

    l2_count = 0
    l3_count = 0
    for u1 in l1_users:
        l2_users = await get_level_users(db, u1.referral_code)
        l2_count += len(l2_users)
        for u2 in l2_users:
            l3_users = await get_level_users(db, u2.referral_code)
            l3_count += len(l3_users)

    tier_name, bonus = get_tier(l1_count)
    return ok(data={
        "level1_count": l1_count,
        "level2_count": l2_count,
        "level3_count": l3_count,
        "total": l1_count + l2_count + l3_count,
        "weekly_bonus_tier": tier_name,
        "weekly_bonus_amount": float(bonus),
    })


@router.get("/level/{level}")
async def team_level(
    level: int = Path(..., ge=1, le=3),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if level == 1:
        users = await get_level_users(db, current_user.referral_code)
    elif level == 2:
        l1 = await get_level_users(db, current_user.referral_code)
        users = []
        for u in l1:
            users.extend(await get_level_users(db, u.referral_code))
    else:
        l1 = await get_level_users(db, current_user.referral_code)
        l2 = []
        for u in l1:
            l2.extend(await get_level_users(db, u.referral_code))
        users = []
        for u in l2:
            users.extend(await get_level_users(db, u.referral_code))

    return ok(data=[{
        "id": u.id,
        "name": u.name or u.mobile,
        "mobile": u.mobile[-4:].rjust(len(u.mobile), "*"),
        "is_premium": u.is_premium,
        "created_at": u.created_at.isoformat() if u.created_at else None,
    } for u in users])
