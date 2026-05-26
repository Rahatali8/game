from sqlalchemy import Integer, String, ForeignKey, DateTime, Text, Boolean, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from datetime import datetime
from typing import Optional
from app.models.base import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    sender_type: Mapped[str] = mapped_column(String(10), nullable=False)  # 'user' or 'admin'
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    message_type: Mapped[str] = mapped_column(String(10), default="text", nullable=False)
    voice_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    voice_duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="messages")
