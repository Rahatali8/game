from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.announcement import Announcement
from app.schemas.common import ok

router = APIRouter(prefix="/announcements", tags=["announcements"])


@router.get("")
async def list_announcements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Announcement).where(Announcement.is_active == True).order_by(Announcement.created_at.desc()).limit(20)
    )
    announcements = result.scalars().all()
    return ok(data=[{
        "id": a.id,
        "title": a.title,
        "body": a.body,
        "banner_url": a.banner_url,
        "created_at": a.created_at.isoformat(),
    } for a in announcements])
