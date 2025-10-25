from pydantic import BaseModel
from typing import List


class DashboardStats(BaseModel):
    """Dashboard statistics response."""
    total_balance: float
    monthly_income: float
    monthly_expenses: float
    savings_rate: float


class RecentTransactionSummary(BaseModel):
    """Summary of recent transactions for dashboard."""
    id: str
    description: str
    amount: float
    type: str
    category_name: str
    category_color: str
    category_icon: str
    transaction_date: str


class DashboardResponse(BaseModel):
    """Complete dashboard data."""
    stats: DashboardStats
    recent_transactions: List[RecentTransactionSummary]
    budgets: List[dict]  # List of budgets with spending
