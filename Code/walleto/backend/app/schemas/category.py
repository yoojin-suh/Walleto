from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    """Schema for creating a new category."""
    name: str = Field(..., min_length=1, max_length=100)
    icon: Optional[str] = None
    color: str = "purple"


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = None
    color: Optional[str] = None


class CategoryResponse(BaseModel):
    """Schema for category response."""
    id: str
    user_id: str
    name: str
    icon: Optional[str]
    color: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
