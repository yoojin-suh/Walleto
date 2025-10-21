from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class Account(Base):
    """
    User's financial accounts (bank accounts, wallets, credit cards).
    """
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Account details
    name = Column(String, nullable=False)  # e.g., "Checking Account", "Cash Wallet"
    type = Column(String, nullable=False)  # checking, savings, credit_card, cash
    balance = Column(Float, default=0.0, nullable=False)  # Current balance
    currency = Column(String, default="USD")  # Currency code

    # Status
    is_active = Column(Boolean, default=True)  # Active/inactive account

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Account {self.name} - ${self.balance}>"
