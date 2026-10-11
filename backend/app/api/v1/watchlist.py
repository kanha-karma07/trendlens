from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.watchlist import WatchlistItem
from app.schemas.auth import MessageResponse
from app.schemas.watchlist import (
    WatchlistItemCreate,
    WatchlistItemResponse,
    WatchlistListResponse,
)

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])


@router.get(
    "",
    response_model=WatchlistListResponse,
    summary="Get authenticated user's watchlist",
)
def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all securities currently saved in user's watchlist."""
    items = db.scalars(
        select(WatchlistItem)
        .where(WatchlistItem.user_id == current_user.id)
        .order_by(WatchlistItem.created_at.desc())
    ).all()

    return WatchlistListResponse(
        items=[WatchlistItemResponse.model_validate(item) for item in items],
        count=len(items),
    )


@router.post(
    "",
    response_model=WatchlistItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add security to watchlist",
)
def add_to_watchlist(
    payload: WatchlistItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a symbol to the authenticated user's personal watchlist."""
    formatted_symbol = payload.symbol.strip().upper()

    existing = db.scalar(
        select(WatchlistItem).where(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.symbol == formatted_symbol,
        )
    )
    if existing:
        return WatchlistItemResponse.model_validate(existing)

    item = WatchlistItem(
        user_id=current_user.id,
        symbol=formatted_symbol,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    return WatchlistItemResponse.model_validate(item)


@router.delete(
    "/{symbol}",
    response_model=MessageResponse,
    summary="Remove security from watchlist",
)
def remove_from_watchlist(
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a security from the authenticated user's watchlist."""
    formatted_symbol = symbol.strip().upper()

    item = db.scalar(
        select(WatchlistItem).where(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.symbol == formatted_symbol,
        )
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Security '{formatted_symbol}' not found in your watchlist.",
        )

    db.delete(item)
    db.commit()

    return MessageResponse(message=f"Removed '{formatted_symbol}' from watchlist.")
