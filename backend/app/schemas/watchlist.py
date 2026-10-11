from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict, Field, field_validator


class WatchlistItemCreate(BaseModel):
    symbol: str = Field(
        ..., min_length=1, max_length=20, description="Stock ticker symbol (e.g. RELIANCE.NS)"
    )

    @field_validator("symbol")
    @classmethod
    def format_symbol(cls, v: str) -> str:
        s = v.strip().upper()
        if not s:
            raise ValueError("Symbol cannot be empty.")
        return s


class WatchlistItemResponse(BaseModel):
    id: str
    symbol: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WatchlistListResponse(BaseModel):
    items: List[WatchlistItemResponse]
    count: int
