import enum
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
)
from sqlalchemy import (
    Enum as SqlEnum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class OutcomeStatus(str, enum.Enum):
    PENDING = "pending"
    WITHIN_RANGE = "within_range"
    OUTSIDE_RANGE = "outside_range"
    NO_OUTCOME = "no_outcome"


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    horizon_min: Mapped[int] = mapped_column(Integer, nullable=False)
    trained_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    data_quality_summary: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    params: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    forecasts = relationship("Forecast", back_populates="model_version")
    fold_results = relationship("FoldResult", back_populates="model_version")


class Forecast(Base):
    __tablename__ = "forecasts"
    __table_args__ = (
        Index("ix_forecasts_symbol_generated_at", "symbol", "generated_at"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    symbol: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    horizon_min: Mapped[int] = mapped_column(Integer, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    target_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    input_interval: Mapped[str] = mapped_column(String(10), default="5m", nullable=False)
    point_estimate: Mapped[float] = mapped_column(Float, nullable=False)
    low_50: Mapped[float] = mapped_column(Float, nullable=False)
    high_50: Mapped[float] = mapped_column(Float, nullable=False)
    low_90: Mapped[float] = mapped_column(Float, nullable=False)
    high_90: Mapped[float] = mapped_column(Float, nullable=False)
    model_version_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("model_versions.id"), nullable=False
    )
    data_ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    freshness: Mapped[str] = mapped_column(String(20), default="demo", nullable=False)
    mode: Mapped[str] = mapped_column(String(20), default="demo", nullable=False)

    model_version = relationship("ModelVersion", back_populates="forecasts")
    outcome = relationship("Outcome", back_populates="forecast", uselist=False)


class Outcome(Base):
    __tablename__ = "outcomes"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    forecast_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("forecasts.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    actual_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    abs_error: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    within_range: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    status: Mapped[OutcomeStatus] = mapped_column(
        SqlEnum(OutcomeStatus, name="outcome_status_enum", native_enum=False),
        default=OutcomeStatus.PENDING,
        nullable=False,
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    forecast = relationship("Forecast", back_populates="outcome")


class FoldResult(Base):
    __tablename__ = "fold_results"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    model_version_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("model_versions.id", ondelete="CASCADE"), nullable=False
    )
    fold: Mapped[int] = mapped_column(Integer, nullable=False)
    train_window: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    test_window: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    mae: Mapped[float] = mapped_column(Float, nullable=False)
    rmse: Mapped[float] = mapped_column(Float, nullable=False)
    directional_acc: Mapped[float] = mapped_column(Float, nullable=False)
    relative_mae: Mapped[float] = mapped_column(Float, nullable=False)
    coverage: Mapped[float] = mapped_column(Float, nullable=False)

    model_version = relationship("ModelVersion", back_populates="fold_results")
