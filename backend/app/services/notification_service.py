from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification


async def create_notification(
    db: AsyncSession,
    user_id: int,
    title: str,
    body: str = "",
    type: str = "info",
    icon: str = "",
) -> None:
    notif = Notification(user_id=user_id, title=title, body=body, type=type, icon=icon)
    db.add(notif)
