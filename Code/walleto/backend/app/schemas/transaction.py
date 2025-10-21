from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TransactionCreate(BaseModel):
    """Schema for creating a new transaction."""
    account_id: Optional[str] = None
    category_id: Optional[str] = None
    type: str = Field(..., pattern="^(income|expense)$")
    amount: float = Field(..., gt=0)
    description: str = Field(..., min_length=1, max_length=200)
    notes: Optional[str] = None
    transaction_date: Optional[datetime] = None


class TransactionUpdate(BaseModel):
    """Schema for updating a transaction."""
    account_id: Optional[str] = None
    category_id: Optional[str] = None
    type: Optional[str] = Field(None, pattern="^(income|expense)$")
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, min_length=1, max_length=200)
    notes: Optional[str] = None
    transaction_date: Optional[datetime] = None


class TransactionResponse(BaseModel):
    """Schema for transaction response."""
    id: str
    user_id: str
    account_id: Optional[str]
    category_id: Optional[str]
    type: str
    amount: float
    description: str
    notes: Optional[str]
    transaction_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class TransactionWithDetails(TransactionResponse):
    """Transaction response with category and account details."""
    category_name: Optional[str] = None
    category_color: Optional[str] = None
    category_icon: Optional[str] = None
    account_name: Optional[str] = None
