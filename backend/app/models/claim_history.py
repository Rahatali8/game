from sqlalchemy import Integer, Numeric, ForeignKey, DateTime, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from decimal import Decimal
from datetime import datetime
from app.models.base import Base


class ClaimHistory(Base):
    __tablename__ = "claim_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    miner_id: Mapped[int] = mapped_column(Integer, ForeignKey("user_miners.id"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    claimed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    miner: Mapped["UserMiner"] = relationship("UserMiner", back_populates="claim_history")
