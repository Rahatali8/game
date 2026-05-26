from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status, Request
from datetime import datetime, timezone
from app.models.user import User
from app.models.wallet import Wallet
from app.models.login_history import LoginHistory
from app.core.security import hash_password, verify_password, create_access_token
from app.utils.helpers import generate_referral_code
from app.utils.parser import parse_device_info


async def register_user(
    db: AsyncSession,
    mobile: str,
    password: str,
    name: str | None,
    referral_code: str | None,
    country_code: str,
) -> tuple[User, str]:
    result = await db.execute(select(User).where(User.mobile == mobile))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Mobile already registered")

    if referral_code:
        ref_result = await db.execute(select(User).where(User.referral_code == referral_code.upper()))
        if not ref_result.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid referral code")

    for _ in range(10):
        code = generate_referral_code()
        exists = await db.execute(select(User).where(User.referral_code == code))
        if not exists.scalar_one_or_none():
            break

    user = User(
        mobile=mobile,
        password_hash=hash_password(password),
        name=name,
        referral_code=code,
        referred_by=referral_code.upper() if referral_code else None,
        country_code=country_code,
    )
    db.add(user)
    await db.flush()

    wallet = Wallet(user_id=user.id)
    db.add(wallet)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "is_admin": user.is_admin})
    return user, token


async def login_user(
    db: AsyncSession,
    mobile: str,
    password: str,
    request: Request | None = None,
) -> tuple[User, str]:
    result = await db.execute(select(User).where(User.mobile == mobile, User.is_active == True))
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid mobile or password")

    user.last_login = datetime.now(timezone.utc)

    await db.execute(
        LoginHistory.__table__.update()
        .where(LoginHistory.user_id == user.id)
        .values(is_current=False)
    )

    device_info = parse_device_info(request) if request else {}
    history = LoginHistory(user_id=user.id, is_current=True, **device_info)
    db.add(history)

    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "is_admin": user.is_admin})
    return user, token
