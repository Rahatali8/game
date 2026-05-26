from sqlalchemy import Integer, Numeric, String, ForeignKey, DateTime, Date, func, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped
from decimal import Decimal
from datetime import datetime, date
from app.models.base import Base


class TaskReward(Base):
    __tablename__ = "task_rewards"
    __table_args__ = (UniqueConstraint("user_id", "task_type", "claimed_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    task_type: Mapped[str] = mapped_column(String(50), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    claimed_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
