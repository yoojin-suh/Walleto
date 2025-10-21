from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class Transaction(Base):
    """
    Financial transactions (income and expenses).
    Records every money movement with category and account.
    """
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    account_id = Column(String, ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True, index=True)
    category_id = Column(String, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)

    # Transaction details
    type = Column(String, nullable=False)  # income or expense
    amount = Column(Float, nullable=False)  # Transaction amount
    description = Column(String, nullable=False)  # e.g., "Grocery shopping"
    notes = Column(Text, nullable=True)  # Additional notes

    # Transaction date (user can backdate transactions)
    transaction_date = Column(DateTime(timezone=True), nullable=False, default=func.now())

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Transaction {self.type} ${self.amount} - {self.description}>"
