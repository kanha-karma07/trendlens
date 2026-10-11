from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import (
    create_access_token,
    hash_password,
    login_rate_limiter,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    MessageResponse,
    TokenResponse,
    UserLoginRequest,
    UserProfileResponse,
    UserRegisterRequest,
    UserUpdateRequest,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new analyst account",
)
def register(
    payload: UserRegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Register a user account with Argon2id password hashing.
    Enforces non-enumerating generic response if email is already registered.
    """
    normalized_email = payload.email.lower().strip()
    existing_user = db.scalar(select(User).where(User.email == normalized_email))

    if existing_user:
        # Non-enumerating generic response: do not disclose existence of email
        return MessageResponse(
            message="Registration request received. If eligible, your account has been created."
        )

    hashed_pw = hash_password(payload.password)
    user = User(
        full_name=payload.full_name.strip(),
        email=normalized_email,
        password_hash=hashed_pw,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return MessageResponse(
        message="Registration request received. If eligible, your account has been created."
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and receive short-lived JWT",
)
def login(
    payload: UserLoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Authenticate user credentials, enforce brute-force rate-limiting,
    and issue short-lived JWT. Error messages are uniform to prevent enumeration.
    """
    client_ip = request.client.host if request.client else "unknown"
    normalized_email = payload.email.lower().strip()
    rate_limit_key = f"{client_ip}:{normalized_email}"

    if login_rate_limiter.is_blocked(rate_limit_key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 5 minutes before retrying.",
        )

    user = db.scalar(select(User).where(User.email == normalized_email))

    # Constant error behavior: do not leak whether email exists
    if not user or not verify_password(payload.password, user.password_hash):
        login_rate_limiter.record_failure(rate_limit_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Success: reset rate limiter
    login_rate_limiter.reset(rate_limit_key)
    access_token = create_access_token(subject=user.id)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_MINUTES,
    )


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get current user profile & preferences",
)
def get_me(current_user: User = Depends(get_current_user)):
    """Return profile and display preferences of the authenticated analyst."""
    return current_user


@router.patch(
    "/me",
    response_model=UserProfileResponse,
    summary="Update user preferences",
)
def update_me(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile and modeling preferences for the authenticated analyst."""
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Change user password",
)
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change user password requiring validation of the current password."""
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed.",
        )

    current_user.password_hash = hash_password(payload.new_password)
    db.add(current_user)
    db.commit()

    return MessageResponse(message="Password changed successfully.")


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Stateless logout acknowledgement",
)
def logout(current_user: User = Depends(get_current_user)):
    """
    Stateless client-side token discard acknowledgement.
    (See docs/auth-decisions.md for server-side token revocation roadmap).
    """
    return MessageResponse(message="Successfully logged out.")
