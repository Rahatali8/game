from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.auth import RegisterRequest, LoginRequest, LoginResponse, UserOut, WalletOut
from app.schemas.common import ok
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user, token = await register_user(
        db,
        mobile=body.mobile,
        password=body.password,
        name=body.name,
        referral_code=body.referral_code,
        country_code=body.country_code,
    )
    return ok(
        data={"access_token": token, "token_type": "bearer", "user": UserOut.model_validate(user)},
        message="Registration successful",
    )


@router.post("/login")
async def login(body: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    user, token = await login_user(db, mobile=body.mobile, password=body.password, request=request)
    wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == user.id))
    wallet = wallet_result.scalar_one_or_none()

    return ok(
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": UserOut.model_validate(user),
            "wallet": WalletOut.model_validate(wallet) if wallet else None,
        },
        message="Login successful",
    )


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return ok(data=UserOut.model_validate(current_user))


@router.post("/logout")
async def logout():
    return ok(message="Logged out")
