from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from fastapi import HTTPException, status
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetWithSpending
from typing import List
from datetime import datetime


def create_budget(db: Session, user_id: str, data: BudgetCreate) -> Budget:
    """Create a new budget."""
    # Verify category exists and belongs to user
    category = db.query(Category).filter(
        Category.id == data.category_id,
        Category.user_id == user_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # Check if budget already exists for this category/month/year
    existing = db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.category_id == data.category_id,
        Budget.month == data.month,
        Budget.year == data.year
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budget already exists for this category and month"
        )

    budget = Budget(
        user_id=user_id,
        category_id=data.category_id,
        amount=data.amount,
        month=data.month,
        year=data.year,
        alert_threshold=data.alert_threshold
    )

    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def get_budgets(db: Session, user_id: str, month: int = None, year: int = None) -> List[BudgetWithSpending]:
    """Get budgets with actual spending."""
    # Default to current month if not specified
    if month is None or year is None:
        now = datetime.now()
        month = month or now.month
        year = year or now.year

    # Get budgets
    budgets = db.query(Budget, Category).join(
        Category, Budget.category_id == Category.id
    ).filter(
        Budget.user_id == user_id,
        Budget.month == month,
        Budget.year == year
    ).all()

    result = []
    for budget, category in budgets:
        # Calculate actual spending for this category in this month
        spent = db.query(func.sum(Transaction.amount)).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.category_id == budget.category_id,
                Transaction.type == "expense",
                extract('month', Transaction.transaction_date) == month,
                extract('year', Transaction.transaction_date) == year
            )
        ).scalar() or 0.0

        spent = float(spent)
        remaining = budget.amount - spent
        percentage = (spent / budget.amount * 100) if budget.amount > 0 else 0
        is_over_budget = spent > budget.amount

        budget_with_spending = BudgetWithSpending(
            id=budget.id,
            user_id=budget.user_id,
            category_id=budget.category_id,
            amount=budget.amount,
            month=budget.month,
            year=budget.year,
            alert_threshold=budget.alert_threshold,
            created_at=budget.created_at,
            updated_at=budget.updated_at,
            spent=spent,
            remaining=remaining,
            percentage=percentage,
            is_over_budget=is_over_budget,
            category_name=category.name,
            category_color=category.color
        )

        result.append(budget_with_spending)

    return result


def get_budget(db: Session, user_id: str, budget_id: str) -> Budget:
    """Get a specific budget."""
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == user_id
    ).first()

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )

    return budget


def update_budget(db: Session, user_id: str, budget_id: str, data: BudgetUpdate) -> Budget:
    """Update a budget."""
    budget = get_budget(db, user_id, budget_id)

    if data.amount is not None:
        budget.amount = data.amount
    if data.alert_threshold is not None:
        budget.alert_threshold = data.alert_threshold

    db.commit()
    db.refresh(budget)
    return budget


def delete_budget(db: Session, user_id: str, budget_id: str):
    """Delete a budget."""
    budget = get_budget(db, user_id, budget_id)

    db.delete(budget)
    db.commit()
    return {"message": "Budget deleted successfully"}
