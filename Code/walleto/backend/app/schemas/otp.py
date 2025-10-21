from pydantic import BaseModel, EmailStr, Field


class OTPGenerate(BaseModel):
    """Schema for OTP generation request."""
    email: EmailStr
    purpose: str  # 'signup' or 'signin'


class OTPVerify(BaseModel):
    """Schema for OTP verification request."""
    email: EmailStr
    otp_code: str
    purpose: str  # 'signup' or 'signin'


class OTPResponse(BaseModel):
    """Schema for OTP generation/resend response."""
    message: str
    expires_in_seconds: int


class SignupVerifyRequest(BaseModel):
    """Schema for signup OTP verification with user data."""
    email: EmailStr
    otp_code: str
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str


class SigninVerifyRequest(BaseModel):
    """Schema for signin OTP verification."""
    email: EmailStr
    otp_code: str
    remember_device: bool = False
