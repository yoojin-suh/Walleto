from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from app.models.transaction import Transaction
from app.models.category import Category
from app.models.account import Account
from app.schemas.dashboard import DashboardStats, RecentTransactionSummary, DashboardResponse
from app.services.account_service import get_total_balance
from app.services.budget_service import get_budgets
from datetime import datetime
from typing import List


def get_dashboard_stats(db: Session, user_id: str) -> DashboardStats:
    """Calculate dashboard statistics for current month."""
    now = datetime.now()
    current_month = now.month
    current_year = now.year

    # Total balance across all accounts
    total_balance = get_total_balance(db, user_id)

    # Current month income
    monthly_income = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == user_id,
            Transaction.type == "income",
            extract('month', Transaction.transaction_date) == current_month,
            extract('year', Transaction.transaction_date) == current_year
        )
    ).scalar() or 0.0

    # Current month expenses
    monthly_expenses = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            extract('month', Transaction.transaction_date) == current_month,
            extract('year', Transaction.transaction_date) == current_year
        )
    ).scalar() or 0.0

    # Calculate savings rate
    savings_rate = 0.0
    if monthly_income > 0:
        savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100

    return DashboardStats(
        total_balance=float(total_balance),
        monthly_income=float(monthly_income),
        monthly_expenses=float(monthly_expenses),
        savings_rate=float(savings_rate)
    )


def get_recent_transactions(db: Session, user_id: str, limit: int = 10) -> List[RecentTransactionSummary]:
    """Get recent transactions for dashboard."""
    results = db.query(
        Transaction,
        Category.name.label("category_name")
    ).outerjoin(
        Category, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == user_id
    ).order_by(
        Transaction.transaction_date.desc()
    ).limit(limit).all()

    transactions = []
    for trans, cat_name in results:
        transactions.append(RecentTransactionSummary(
            id=trans.id,
            description=trans.description,
            amount=trans.amount if trans.type == "income" else -trans.amount,
            type=trans.type,
            category_name=cat_name or "Uncategorized",
            category_color="gray",
            category_icon="FiDollarSign",
            transaction_date=trans.transaction_date.strftime("%Y-%m-%d")
        ))

    return transactions


def get_dashboard_data(db: Session, user_id: str) -> DashboardResponse:
    """Get complete dashboard data."""
    stats = get_dashboard_stats(db, user_id)
    recent_transactions = get_recent_transactions(db, user_id)
    budgets = get_budgets(db, user_id)

    # Convert budgets to dict format
    budget_dicts = [
        {
            "id": b.id,
            "category_name": b.category_name,
            "amount": b.amount,
            "spent": b.spent,
            "remaining": b.remaining,
            "percentage": b.percentage,
            "is_over_budget": b.is_over_budget
        }
        for b in budgets
    ]

    return DashboardResponse(
        stats=stats,
        recent_transactions=recent_transactions,
        budgets=budget_dicts
    )
