from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.otp import OTPGenerate, OTPVerify, OTPResponse
from app.services.otp_service import create_otp, verify_otp

router = APIRouter(prefix="/otp", tags=["OTP"])


@router.post("/generate", response_model=OTPResponse)
async def generate_otp(
    data: OTPGenerate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Generate and send OTP to email.

    Rate limits:
    - Maximum 3 requests per 10 minutes per email

    Args:
        data: Email and purpose (signup/signin)

    Returns:
        Message and expiration time
    """
    result = await create_otp(db, data.email, data.purpose, request)
    return {
        "message": "Verification code sent to your email",
        "expires_in_seconds": result["expires_in_seconds"]
    }


@router.post("/verify")
async def verify_otp_endpoint(
    data: OTPVerify,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Verify OTP code.

    Rate limits:
    - Maximum 5 attempts per 10 minutes per email

    Args:
        data: Email, OTP code, and purpose

    Returns:
        Success message
    """
    verify_otp(db, data.email, data.otp_code, data.purpose, request)
    return {"message": "Verification code verified successfully"}


@router.post("/resend", response_model=OTPResponse)
async def resend_otp(
    data: OTPGenerate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Resend OTP to email (subject to same rate limiting as generation).

    Args:
        data: Email and purpose

    Returns:
        Message and expiration time
    """
    result = await create_otp(db, data.email, data.purpose, request)
    return {
        "message": "Verification code resent to your email",
        "expires_in_seconds": result["expires_in_seconds"]
    }
