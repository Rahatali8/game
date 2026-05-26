from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import Optional
import os
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.message import Message
from app.schemas.message import MessageOut, SendMessageRequest
from app.schemas.common import ok
from app.core.config import settings
from app.utils.helpers import generate_uuid_filename, validate_audio_ext, save_upload

router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("")
async def get_messages(
    last_id: int = Query(0),
    limit: int = Query(50, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Message).where(Message.user_id == current_user.id)
    if last_id:
        q = q.where(Message.id > last_id)
    q = q.order_by(Message.created_at.asc()).limit(limit)
    result = await db.execute(q)
    messages = result.scalars().all()
    return ok(data=[MessageOut.model_validate(m) for m in messages])


@router.post("/text")
async def send_text(
    body: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    msg = Message(user_id=current_user.id, sender_type="user", message=body.message, message_type="text")
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return ok(data=MessageOut.model_validate(msg))


@router.post("/voice")
async def send_voice(
    duration: int = Form(0),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not validate_audio_ext(file.filename or ""):
        raise HTTPException(status_code=400, detail="Only audio files allowed")

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")

    fname = generate_uuid_filename(file.filename or "voice.webm")
    voice_dir = os.path.join(settings.UPLOAD_DIR, "voices")
    save_upload(content, voice_dir, fname)
    voice_url = f"/uploads/voices/{fname}"

    msg = Message(
        user_id=current_user.id,
        sender_type="user",
        message_type="voice",
        voice_url=voice_url,
        voice_duration=duration,
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return ok(data=MessageOut.model_validate(msg))


@router.delete("/clear")
async def clear_messages(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.execute(delete(Message).where(Message.user_id == current_user.id))
    await db.commit()
    return ok(message="Chat cleared")
