from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from typing import List, Optional


def create_category(db: Session, user_id: str, data: CategoryCreate) -> Category:
    """Create a new category for the user."""
    # Check if category name already exists for this user
    existing = db.query(Category).filter(
        Category.user_id == user_id,
        Category.name == data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )

    category = Category(
        user_id=user_id,
        name=data.name,
        type=data.type
    )

    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_categories(db: Session, user_id: str, type_filter: Optional[str] = None) -> List[Category]:
    """Get all categories for the user, optionally filtered by type (income/expense)."""
    query = db.query(Category).filter(Category.user_id == user_id)

    if type_filter and type_filter in ['income', 'expense']:
        query = query.filter(Category.type == type_filter)

    return query.all()


def get_category(db: Session, user_id: str, category_id: str) -> Optional[Category]:
    """Get a specific category."""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == user_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    return category


def update_category(db: Session, user_id: str, category_id: str, data: CategoryUpdate) -> Category:
    """Update a category."""
    category = get_category(db, user_id, category_id)

    # Check name uniqueness if name is being updated
    if data.name and data.name != category.name:
        existing = db.query(Category).filter(
            Category.user_id == user_id,
            Category.name == data.name,
            Category.id != category_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists"
            )

    # Update fields
    if data.name is not None:
        category.name = data.name
    if data.type is not None:
        category.type = data.type

    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, user_id: str, category_id: str):
    """Delete a category."""
    category = get_category(db, user_id, category_id)

    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}
