from sqlalchemy import String, Boolean, Integer, DateTime, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from datetime import datetime
from typing import Optional
from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    mobile: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    withdraw_pin: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    referral_code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    referred_by: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    is_premium: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    premium_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    country_code: Mapped[str] = mapped_column(String(5), default="+92", nullable=False)

    wallet: Mapped[Optional["Wallet"]] = relationship("Wallet", back_populates="user", uselist=False)
    miners: Mapped[list["UserMiner"]] = relationship("UserMiner", back_populates="user")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="user")
    login_history: Mapped[list["LoginHistory"]] = relationship("LoginHistory", back_populates="user")
    notifications: Mapped[list["Notification"]] = relationship("Notification", back_populates="user")
