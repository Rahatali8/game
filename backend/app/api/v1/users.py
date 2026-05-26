from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import verify_password, hash_password
from app.models.user import User
from app.models.login_history import LoginHistory
from app.schemas.user import UpdateProfileRequest, ChangePasswordRequest, SetWithdrawPinRequest, LoginHistoryOut
from app.schemas.auth import UserOut
from app.schemas.common import ok
from app.core.config import settings
from app.utils.helpers import generate_uuid_filename, validate_image_ext, save_upload
import os

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return ok(data=UserOut.model_validate(current_user))


@router.patch("/profile")
async def update_profile(
    body: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.name is not None:
        current_user.name = body.name
    if body.country_code is not None:
        current_user.country_code = body.country_code
    await db.commit()
    await db.refresh(current_user)
    return ok(data=UserOut.model_validate(current_user))


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    current_user.password_hash = hash_password(body.new_password)
    await db.commit()
    return ok(message="Password changed successfully")


@router.post("/set-withdraw-pin")
async def set_withdraw_pin(
    body: SetWithdrawPinRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Password is incorrect")
    if len(body.pin) < 4:
        raise HTTPException(status_code=400, detail="PIN must be at least 4 digits")
    current_user.withdraw_pin = hash_password(body.pin)
    await db.commit()
    return ok(message="Withdraw PIN set successfully")


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not validate_image_ext(file.filename or ""):
        raise HTTPException(status_code=400, detail="Only image files allowed (jpg, png, webp)")

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large (max {settings.MAX_UPLOAD_SIZE_MB}MB)")

    fname = generate_uuid_filename(file.filename or "avatar.jpg")
    avatar_dir = os.path.join(settings.UPLOAD_DIR, "avatars")
    save_upload(content, avatar_dir, fname)

    current_user.avatar_url = f"/uploads/avatars/{fname}"
    await db.commit()
    return ok(data={"avatar_url": current_user.avatar_url})


@router.get("/login-history")
async def login_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LoginHistory)
        .where(LoginHistory.user_id == current_user.id)
        .order_by(LoginHistory.login_time.desc())
        .limit(20)
    )
    history = result.scalars().all()
    return ok(data=[LoginHistoryOut.model_validate(h) for h in history])
