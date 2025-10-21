from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from datetime import datetime
from app.core.database import Base
import uuid


class TrustedDevice(Base):
    """Model for storing trusted devices that can skip OTP verification."""
    __tablename__ = "trusted_devices"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    device_token = Column(String, unique=True, nullable=False, index=True)
    device_info = Column(String, nullable=True)  # User agent or device fingerprint
    ip_address = Column(String, nullable=True)
    last_used = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
