from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime
import uuid
from app.core.database import Base


class OTP(Base):
    """Model for storing one-time passwords for email verification."""
    __tablename__ = "otps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, nullable=False, index=True)
    otp_code = Column(String(6), nullable=False)
    purpose = Column(String(20), nullable=False)  # 'signup' or 'signin'
    expires_at = Column(DateTime, nullable=False)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)

    def __repr__(self):
        return f"<OTP {self.email} - {self.purpose}>"


class OTPAttempt(Base):
    """Model for tracking OTP generation and verification attempts (rate limiting & audit)."""
    __tablename__ = "otp_attempts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, nullable=False, index=True)
    attempt_type = Column(String(20), nullable=False)  # 'generate' or 'verify'
    success = Column(Boolean, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    def __repr__(self):
        return f"<OTPAttempt {self.email} - {self.attempt_type}>"
