from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from typing import Optional
import os
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.transaction import Deposit
from app.schemas.transaction import DepositOut
from app.schemas.common import ok
from app.core.config import settings
from app.utils.helpers import generate_uuid_filename, validate_image_ext, save_upload

router = APIRouter(prefix="/deposits", tags=["deposits"])


@router.post("")
async def create_deposit(
    amount: Decimal = Form(...),
    method: str = Form(...),
    txn_id: Optional[str] = Form(None),
    screenshot: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if amount < Decimal("1"):
        raise HTTPException(status_code=400, detail="Minimum deposit is $1")

    screenshot_url = None
    if screenshot and screenshot.filename:
        if not validate_image_ext(screenshot.filename):
            raise HTTPException(status_code=400, detail="Only image files allowed")
        content = await screenshot.read()
        if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large")
        fname = generate_uuid_filename(screenshot.filename)
        deposit_dir = os.path.join(settings.UPLOAD_DIR, "deposits")
        save_upload(content, deposit_dir, fname)
        screenshot_url = f"/uploads/deposits/{fname}"

    deposit = Deposit(
        user_id=current_user.id,
        amount=amount,
        method=method,
        txn_id=txn_id,
        screenshot_url=screenshot_url,
        status="pending",
    )
    db.add(deposit)
    await db.commit()
    await db.refresh(deposit)
    return ok(data=DepositOut.model_validate(deposit), message="Deposit request submitted")


@router.get("/history")
async def deposit_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Deposit).where(Deposit.user_id == current_user.id).order_by(Deposit.created_at.desc()).limit(50)
    )
    return ok(data=[DepositOut.model_validate(d) for d in result.scalars().all()])
