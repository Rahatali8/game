from sqlalchemy import Integer, Numeric, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import mapped_column, Mapped, relationship
from decimal import Decimal
from datetime import datetime
from typing import Optional
from app.models.base import Base


class UserMiner(Base):
    __tablename__ = "user_miners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String(100), nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    purchase_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    daily_income: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    total_income: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    period_days: Mapped[int] = mapped_column(Integer, nullable=False)
    days_claimed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_claim_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default="now()", nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="miners")
    product: Mapped["Product"] = relationship("Product")
    claim_history: Mapped[list["ClaimHistory"]] = relationship("ClaimHistory", back_populates="miner")
