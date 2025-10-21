from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models.user import User

# Import schemas
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse, BudgetWithSpending
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse, TransactionWithDetails
from app.schemas.dashboard import DashboardResponse

# Import services
from app.services import category_service, budget_service, account_service, transaction_service, dashboard_service

router = APIRouter(prefix="/financial", tags=["Financial"])


# ============================================
# DASHBOARD ROUTES
# ============================================

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complete dashboard data with stats, transactions, and budgets."""
    return dashboard_service.get_dashboard_data(db, current_user.id)


# ============================================
# CATEGORY ROUTES
# ============================================

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new budget category."""
    return category_service.create_category(db, current_user.id, data)


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all categories for the current user."""
    return category_service.get_categories(db, current_user.id)


@router.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific category."""
    return category_service.get_category(db, current_user.id, category_id)


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    data: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a category."""
    return category_service.update_category(db, current_user.id, category_id, data)


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a category."""
    return category_service.delete_category(db, current_user.id, category_id)


# ============================================
# BUDGET ROUTES
# ============================================

@router.post("/budgets", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new budget limit for a category."""
    return budget_service.create_budget(db, current_user.id, data)


@router.get("/budgets", response_model=List[BudgetWithSpending])
def get_budgets(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2020, le=2100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all budgets with actual spending for a specific month."""
    return budget_service.get_budgets(db, current_user.id, month, year)


@router.get("/budgets/{budget_id}", response_model=BudgetResponse)
def get_budget(
    budget_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific budget."""
    return budget_service.get_budget(db, current_user.id, budget_id)


@router.put("/budgets/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: str,
    data: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a budget."""
    return budget_service.update_budget(db, current_user.id, budget_id, data)


@router.delete("/budgets/{budget_id}")
def delete_budget(
    budget_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a budget."""
    return budget_service.delete_budget(db, current_user.id, budget_id)


# ============================================
# ACCOUNT ROUTES
# ============================================

@router.post("/accounts", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
def create_account(
    data: AccountCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new account (bank account, wallet, etc.)."""
    return account_service.create_account(db, current_user.id, data)


@router.get("/accounts", response_model=List[AccountResponse])
def get_accounts(
    active_only: bool = True,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all accounts for the current user."""
    return account_service.get_accounts(db, current_user.id, active_only)


@router.get("/accounts/{account_id}", response_model=AccountResponse)
def get_account(
    account_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific account."""
    return account_service.get_account(db, current_user.id, account_id)


@router.put("/accounts/{account_id}", response_model=AccountResponse)
def update_account(
    account_id: str,
    data: AccountUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an account."""
    return account_service.update_account(db, current_user.id, account_id, data)


@router.delete("/accounts/{account_id}")
def delete_account(
    account_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an account."""
    return account_service.delete_account(db, current_user.id, account_id)


# ============================================
# TRANSACTION ROUTES
# ============================================

@router.post("/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new transaction (income or expense)."""
    return transaction_service.create_transaction(db, current_user.id, data)


@router.get("/transactions", response_model=List[TransactionWithDetails])
def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    type: Optional[str] = Query(None, regex="^(income|expense)$"),
    category_id: Optional[str] = None,
    account_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all transactions with filters."""
    return transaction_service.get_transactions(
        db, current_user.id, skip, limit, type, category_id, account_id
    )


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific transaction."""
    return transaction_service.get_transaction(db, current_user.id, transaction_id)


@router.put("/transactions/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: str,
    data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a transaction."""
    return transaction_service.update_transaction(db, current_user.id, transaction_id, data)


@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a transaction."""
    return transaction_service.delete_transaction(db, current_user.id, transaction_id)


@router.get("/transactions/summary/monthly")
def get_monthly_summary(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2020, le=2100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get income and expense summary for a specific month."""
    return transaction_service.get_monthly_summary(db, current_user.id, month, year)
