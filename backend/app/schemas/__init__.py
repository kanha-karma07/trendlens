from app.schemas.auth import (
    ChangePasswordRequest,
    MessageResponse,
    TokenResponse,
    UserLoginRequest,
    UserProfileResponse,
    UserRegisterRequest,
    UserUpdateRequest,
)
from app.schemas.watchlist import (
    WatchlistItemCreate,
    WatchlistItemResponse,
    WatchlistListResponse,
)

__all__ = [
    "UserRegisterRequest",
    "UserLoginRequest",
    "TokenResponse",
    "UserProfileResponse",
    "UserUpdateRequest",
    "ChangePasswordRequest",
    "MessageResponse",
    "WatchlistItemCreate",
    "WatchlistItemResponse",
    "WatchlistListResponse",
]
