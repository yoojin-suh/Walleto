from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    device_token: str | None = None


class UserUpdate(BaseModel):
    username: Optional[str] = None
    nickname: Optional[str] = None
    profile_picture: Optional[str] = None
    birthdate: Optional[date] = None
    secondary_email: Optional[str] = None
    phone_number: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    onboarding_completed: Optional[bool] = None


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    username: Optional[str] = None
    nickname: Optional[str] = None
    profile_picture: Optional[str] = None
    birthdate: Optional[date] = None
    secondary_email: Optional[str] = None
    phone_number: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    onboarding_completed: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    device_token: str | None = None
    skip_otp: bool = False


class TokenData(BaseModel):
    email: Optional[str] = None


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordReset(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str = Field(..., min_length=8)


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
