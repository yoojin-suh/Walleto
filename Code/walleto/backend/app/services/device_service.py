from sqlalchemy.orm import Session
from fastapi import Request
from datetime import datetime, timedelta
import secrets
import hashlib
from app.models.trusted_device import TrustedDevice


def generate_device_token() -> str:
    """Generate a secure random device token."""
    random_bytes = secrets.token_bytes(32)
    return hashlib.sha256(random_bytes).hexdigest()


def create_trusted_device(
    db: Session,
    user_id: str,
    request: Request,
    days_valid: int = 30
) -> TrustedDevice:
    """
    Create a new trusted device entry.

    Args:
        db: Database session
        user_id: User's ID
        request: FastAPI request object
        days_valid: Number of days the device should be trusted (default 30)

    Returns:
        TrustedDevice: The created trusted device record
    """
    device_token = generate_device_token()
    expires_at = datetime.now() + timedelta(days=days_valid)

    trusted_device = TrustedDevice(
        user_id=user_id,
        device_token=device_token,
        device_info=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
        expires_at=expires_at
    )

    db.add(trusted_device)
    db.commit()
    db.refresh(trusted_device)

    return trusted_device


def verify_trusted_device(
    db: Session,
    user_id: str,
    device_token: str,
    request: Request
) -> bool:
    """
    Verify if a device is trusted and still valid.

    Args:
        db: Database session
        user_id: User's ID
        device_token: Device token to verify
        request: FastAPI request object

    Returns:
        bool: True if device is trusted and valid, False otherwise
    """
    device = db.query(TrustedDevice).filter(
        TrustedDevice.user_id == user_id,
        TrustedDevice.device_token == device_token,
        TrustedDevice.is_active == True,
        TrustedDevice.expires_at > datetime.now()
    ).first()

    if device:
        # Update last_used timestamp
        device.last_used = datetime.now()
        db.commit()
        return True

    return False


def revoke_trusted_device(db: Session, user_id: str, device_token: str) -> bool:
    """
    Revoke a trusted device.

    Args:
        db: Database session
        user_id: User's ID
        device_token: Device token to revoke

    Returns:
        bool: True if device was revoked, False if not found
    """
    device = db.query(TrustedDevice).filter(
        TrustedDevice.user_id == user_id,
        TrustedDevice.device_token == device_token
    ).first()

    if device:
        device.is_active = False
        db.commit()
        return True

    return False


def cleanup_expired_devices(db: Session) -> int:
    """
    Remove expired trusted devices from database.

    Args:
        db: Database session

    Returns:
        int: Number of devices deleted
    """
    deleted = db.query(TrustedDevice).filter(
        TrustedDevice.expires_at < datetime.now()
    ).delete()

    db.commit()
    return deleted
