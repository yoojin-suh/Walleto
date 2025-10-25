from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class Category(Base):
    """
    Budget categories for organizing income and expenses.
    Users can create custom categories like 'Food', 'Transport', 'Salary', etc.
    """
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Category details
    name = Column(String, nullable=False)  # e.g., "Food & Dining", "Salary"
    type = Column(String, nullable=False, default="expense")  # 'income' or 'expense'

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Category {self.name}>"
