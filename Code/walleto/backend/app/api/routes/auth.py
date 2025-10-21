from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import EmailStr
from app.core.database import get_db
from app.core.security import decode_access_token, verify_password, get_password_hash
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, UserUpdate, PasswordResetRequest, PasswordReset, PasswordChange
from app.schemas.otp import SignupVerifyRequest, SigninVerifyRequest
from app.services.auth import (
    create_user,
    authenticate_user,
    create_user_token,
    get_user_by_email,
    update_user_profile,
    reset_user_password,
)
from app.services.otp_service import create_otp, verify_otp
from app.services.device_service import verify_trusted_device, create_trusted_device

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current authenticated user from token."""
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    user = create_user(db, user_data)
    access_token = create_user_token(user)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signin", response_model=Token)
def signin(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return token."""
    user = authenticate_user(db, credentials)
    access_token = create_user_token(user)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    update_data: UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile."""
    return update_user_profile(db, current_user.id, update_data)


# OTP-based authentication endpoints

@router.post("/signup/request-otp")
async def signup_request_otp(
    user_data: UserCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Step 1 of signup: Validate data and send OTP (don't create user yet).

    Checks if email is already registered, then sends OTP for verification.
    """
    # Check if email already exists
    existing = get_user_by_email(db, user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Send OTP
    await create_otp(db, user_data.email, "signup", request)

    return {"message": "Verification code sent to your email"}


@router.post("/signup/verify", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup_verify(
    data: SignupVerifyRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Step 2 of signup: Verify OTP and create user.

    After OTP is verified, creates the user account and returns access token.
    """
    # Verify OTP
    verify_otp(db, data.email, data.otp_code, "signup", request)

    # Create user data object
    user_data = UserCreate(
        email=data.email,
        password=data.password,
        first_name=data.first_name,
        last_name=data.last_name
    )

    # Create user
    user = create_user(db, user_data)
    access_token = create_user_token(user)

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signin/request-otp")
async def signin_request_otp(
    credentials: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Step 1 of signin: Validate password and check if device is trusted.

    If device_token is provided and valid, returns access token directly (skip OTP).
    Otherwise, authenticates password and sends OTP for two-factor verification.
    """
    # Authenticate with password first
    user = authenticate_user(db, credentials)

    # Check if device is trusted (skip OTP)
    if credentials.device_token:
        is_trusted = verify_trusted_device(
            db, user.id, credentials.device_token, request
        )
        if is_trusted:
            # Device is trusted, return token directly
            access_token = create_user_token(user)
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "skip_otp": True
            }

    # Device not trusted or no device_token provided - send OTP
    await create_otp(db, user.email, "signin", request)

    return {"message": "Verification code sent to your email", "skip_otp": False}


@router.post("/signin/verify", response_model=Token)
async def signin_verify(
    data: SigninVerifyRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Step 2 of signin: Verify OTP and return access token.

    After OTP is verified, returns the JWT access token.
    If remember_device is True, creates a new trusted device token.
    """
    # Verify OTP
    verify_otp(db, data.email, data.otp_code, "signin", request)

    # Get user and create token
    user = get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    access_token = create_user_token(user)

    # Create trusted device if requested
    device_token = None
    if data.remember_device:
        trusted_device = create_trusted_device(db, user.id, request)
        device_token = trusted_device.device_token

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "device_token": device_token,
        "skip_otp": False
    }


# Password reset endpoints

@router.post("/forgot-password/request-otp")
async def forgot_password_request_otp(
    data: PasswordResetRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Step 1 of password reset: Verify email exists and send OTP.
    """
    # Check if user exists
    user = get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email"
        )

    # Send OTP for password reset
    await create_otp(db, data.email, "password_reset", request)

    return {"message": "Password reset code sent to your email"}


@router.post("/forgot-password/reset")
async def forgot_password_reset(
    data: PasswordReset,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Step 2 of password reset: Verify OTP and update password.
    """
    # Verify OTP
    verify_otp(db, data.email, data.otp_code, "password_reset", request)

    # Reset password
    reset_user_password(db, data.email, data.new_password)

    return {"message": "Password reset successful. You can now sign in with your new password."}


# Change password endpoint (for logged-in users)

@router.post("/change-password")
def change_password(
    data: PasswordChange,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change password for authenticated user.
    Requires current password verification.
    """
    # Verify user has a password (not OAuth-only user)
    if not current_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change password for OAuth-only accounts"
        )

    # Verify current password
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Update to new password
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    return {"message": "Password changed successfully"}
