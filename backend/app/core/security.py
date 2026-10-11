import re
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError

from app.core.config import settings

# Initialize Argon2id password hasher with secure defaults
_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash password using Argon2id."""
    return _hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against Argon2id hash."""
    try:
        return _hasher.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def validate_password_strength(password: str) -> None:
    """
    Enforce password policy:
    - Minimum 8 characters
    - At least 1 uppercase letter
    - At least 1 digit
    - At least 1 special character
    """
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter.")
    if not re.search(r"[0-9]", password):
        raise ValueError("Password must contain at least one number.")
    if not re.search(r'[!@#$%^&*(),.?":{}|<>\-_=+]', password):
        raise ValueError("Password must contain at least one special character.")


def create_access_token(
    subject: str, expires_delta: Optional[timedelta] = None
) -> str:
    """Generate signed JWT access token."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    encoded_jwt = jwt.encode(
        payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except (jwt.PyJWTError, Exception):
        return None


class LoginRateLimiter:
    """
    In-memory sliding-window rate limiter for failed login attempts.
    Blocks after max_attempts failures within the window.
    """

    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self._failures: Dict[str, List[float]] = defaultdict(list)

    def _cleanup(self, key: str, now: float) -> None:
        threshold = now - self.window_seconds
        self._failures[key] = [t for t in self._failures[key] if t > threshold]

    def is_blocked(self, key: str) -> bool:
        now = time.time()
        self._cleanup(key, now)
        return len(self._failures[key]) >= self.max_attempts

    def record_failure(self, key: str) -> None:
        now = time.time()
        self._cleanup(key, now)
        self._failures[key].append(now)

    def reset(self, key: str) -> None:
        if key in self._failures:
            del self._failures[key]


login_rate_limiter = LoginRateLimiter(max_attempts=5, window_seconds=300)
