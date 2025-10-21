from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Request
from datetime import datetime, timedelta
import secrets
import logging
from app.models.otp import OTP, OTPAttempt
from app.services.email import send_otp_email

logger = logging.getLogger(__name__)


def generate_otp_code() -> str:
    """Generate a random 6-digit OTP code."""
    return ''.join([str(secrets.randbelow(10)) for _ in range(6)])


def check_rate_limit(db: Session, email: str, attempt_type: str, request: Request):
    """
    Check if user has exceeded rate limits.

    Args:
        db: Database session
        email: User's email
        attempt_type: 'generate' or 'verify'
        request: FastAPI request object

    Raises:
        HTTPException: If rate limit exceeded
    """
    cutoff = datetime.now() - timedelta(minutes=10)

    attempts = db.query(OTPAttempt).filter(
        OTPAttempt.email == email,
        OTPAttempt.attempt_type == attempt_type,
        OTPAttempt.created_at > cutoff
    ).count()

    # Max 3 OTP generation requests per 10 minutes
    if attempt_type == "generate" and attempts >= 3:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP requests. Please wait 10 minutes before trying again."
        )

    # Max 5 verification attempts per 10 minutes
    if attempt_type == "verify" and attempts >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many verification attempts. Please wait 10 minutes before trying again."
        )


async def create_otp(db: Session, email: str, purpose: str, request: Request) -> dict:
    """
    Generate OTP and send it via email.

    Args:
        db: Database session
        email: User's email
        purpose: 'signup' or 'signin'
        request: FastAPI request object

    Returns:
        dict with expires_in_seconds

    Raises:
        HTTPException: If rate limit exceeded or email sending fails
    """
    # Check rate limit
    check_rate_limit(db, email, "generate", request)

    # Delete any existing unverified OTPs for this email and purpose
    db.query(OTP).filter(
        OTP.email == email,
        OTP.purpose == purpose,
        OTP.verified == False
    ).delete()
    db.commit()

    # Generate new OTP
    otp_code = generate_otp_code()
    expires_at = datetime.now() + timedelta(minutes=6)

    otp = OTP(
        email=email,
        otp_code=otp_code,
        purpose=purpose,
        expires_at=expires_at
    )

    db.add(otp)

    # Log attempt
    db.add(OTPAttempt(
        email=email,
        attempt_type="generate",
        success=True,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    ))

    db.commit()

    # Send email
    try:
        await send_otp_email(email, otp_code, purpose)
        logger.info(f"OTP generated and sent to {email} for {purpose}")
    except Exception as e:
        logger.error(f"Failed to send OTP email: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email. Please try again."
        )

    return {"expires_in_seconds": 360}


def verify_otp(db: Session, email: str, otp_code: str, purpose: str, request: Request) -> bool:
    """
    Verify OTP code.

    Args:
        db: Database session
        email: User's email
        otp_code: The OTP code to verify
        purpose: 'signup' or 'signin'
        request: FastAPI request object

    Returns:
        bool: True if verification successful

    Raises:
        HTTPException: If rate limit exceeded or OTP invalid/expired
    """
    # Check rate limit
    check_rate_limit(db, email, "verify", request)

    # Get valid OTP
    otp = db.query(OTP).filter(
        OTP.email == email,
        OTP.purpose == purpose,
        OTP.otp_code == otp_code,
        OTP.expires_at > datetime.now(),
        OTP.verified == False
    ).first()

    success = otp is not None

    # Log attempt
    db.add(OTPAttempt(
        email=email,
        attempt_type="verify",
        success=success,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    ))

    if success:
        # Mark as verified (prevents reuse)
        otp.verified = True
        db.commit()
        logger.info(f"OTP verified successfully for {email} ({purpose})")
        return True
    else:
        db.commit()
        logger.warning(f"Invalid OTP attempt for {email} ({purpose})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code. Please try again or request a new code."
        )


def cleanup_expired_otps(db: Session) -> tuple:
    """
    Cleanup expired OTPs and old attempts.

    Args:
        db: Database session

    Returns:
        tuple: (deleted_otps_count, deleted_attempts_count)
    """
    # Delete expired OTPs (older than now)
    deleted_otps = db.query(OTP).filter(
        OTP.expires_at < datetime.now()
    ).delete()

    # Delete old attempts (keep 7 days for security audit)
    cutoff = datetime.now() - timedelta(days=7)
    deleted_attempts = db.query(OTPAttempt).filter(
        OTPAttempt.created_at < cutoff
    ).delete()

    db.commit()

    if deleted_otps > 0 or deleted_attempts > 0:
        logger.info(f"Cleanup: {deleted_otps} expired OTPs and {deleted_attempts} old attempts deleted")

    return deleted_otps, deleted_attempts
