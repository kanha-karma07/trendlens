import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    theme: Mapped[str] = mapped_column(String(20), default="dark", nullable=False)
    default_stock: Mapped[str] = mapped_column(String(20), default="RELIANCE.NS", nullable=False)
    default_horizon: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    timezone: Mapped[str] = mapped_column(String(50), default="Asia/Kolkata", nullable=False)
    show_uncertainty: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    show_90_band: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email_on_resolve: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    watchlist_items = relationship(
        "WatchlistItem", back_populates="user", cascade="all, delete-orphan"
    )
