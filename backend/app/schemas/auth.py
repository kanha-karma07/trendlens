from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.security import validate_password_strength


class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Full name of user")
    email: EmailStr = Field(..., description="Valid unique email address")
    password: str = Field(..., min_length=8, description="Strong password")

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        validate_password_strength(v)
        return v


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="Account password")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int


class UserProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    created_at: datetime
    theme: str
    default_stock: str
    default_horizon: int
    timezone: str
    show_uncertainty: bool
    show_90_band: bool
    email_on_resolve: bool

    model_config = ConfigDict(from_attributes=True)


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    theme: Optional[str] = Field(None, pattern="^(dark|light|navy)$")
    default_stock: Optional[str] = Field(None, min_length=2, max_length=20)
    default_horizon: Optional[int] = Field(None, ge=1, le=120)
    timezone: Optional[str] = Field(None, max_length=50)
    show_uncertainty: Optional[bool] = None
    show_90_band: Optional[bool] = None
    email_on_resolve: Optional[bool] = None


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, description="New strong password")

    @field_validator("new_password")
    @classmethod
    def check_new_password_strength(cls, v: str) -> str:
        validate_password_strength(v)
        return v


class MessageResponse(BaseModel):
    message: str
