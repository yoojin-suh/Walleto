from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class Budget(Base):
    """
    Monthly budget limits for each category.
    Users set spending limits to control their expenses.
    """
    __tablename__ = "budgets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(String, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)

    # Budget details
    amount = Column(Float, nullable=False)  # Monthly budget limit
    month = Column(Integer, nullable=False)  # Month (1-12)
    year = Column(Integer, nullable=False)  # Year (e.g., 2025)

    # Alert settings
    alert_threshold = Column(Float, default=80.0)  # Alert when 80% spent

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Budget ${self.amount} for {self.month}/{self.year}>"
