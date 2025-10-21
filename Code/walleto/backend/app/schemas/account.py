from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AccountCreate(BaseModel):
    """Schema for creating a new account."""
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., pattern="^(checking|savings|credit_card|cash)$")
    balance: float = 0.0
    currency: str = "USD"


class AccountUpdate(BaseModel):
    """Schema for updating an account."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = Field(None, pattern="^(checking|savings|credit_card|cash)$")
    balance: Optional[float] = None
    currency: Optional[str] = None
    is_active: Optional[bool] = None


class AccountResponse(BaseModel):
    """Schema for account response."""
    id: str
    user_id: str
    name: str
    type: str
    balance: float
    currency: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
