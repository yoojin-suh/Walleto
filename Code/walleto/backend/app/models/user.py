from sqlalchemy import Column, String, Boolean, DateTime, Date
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for Google OAuth users

    # Basic info
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    # Profile info (from onboarding)
    username = Column(String, unique=True, index=True, nullable=True)
    nickname = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)  # Base64 encoded image

    # Additional profile information
    birthdate = Column(Date, nullable=True)
    secondary_email = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)

    # Address information
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    country = Column(String, nullable=True, default='USA')

    # OAuth
    google_id = Column(String, unique=True, index=True, nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    onboarding_completed = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.email}>"
