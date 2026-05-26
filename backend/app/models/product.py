from sqlalchemy import Integer, Numeric, String, Boolean, Text
from sqlalchemy.orm import mapped_column, Mapped
from decimal import Decimal
from typing import Optional
from app.models.base import Base, TimestampMixin


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    old_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    daily_income: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    total_income: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    period_days: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity_limit: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    country: Mapped[str] = mapped_column(String(50), default="global", nullable=False)
    is_premium_miner: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    offer_tag: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    card_color: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
