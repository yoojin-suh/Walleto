from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BudgetCreate(BaseModel):
    """Schema for creating a new budget."""
    category_id: str
    amount: float = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2020, le=2100)
    alert_threshold: float = Field(80.0, ge=0, le=100)


class BudgetUpdate(BaseModel):
    """Schema for updating a budget."""
    amount: Optional[float] = Field(None, gt=0)
    alert_threshold: Optional[float] = Field(None, ge=0, le=100)


class BudgetResponse(BaseModel):
    """Schema for budget response."""
    id: str
    user_id: str
    category_id: str
    amount: float
    month: int
    year: int
    alert_threshold: float
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class BudgetWithSpending(BudgetResponse):
    """Budget response with actual spending."""
    spent: float = 0.0
    remaining: float = 0.0
    percentage: float = 0.0
    is_over_budget: bool = False
    category_name: str
    category_color: str
