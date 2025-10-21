from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate
from typing import List, Optional


def create_account(db: Session, user_id: str, data: AccountCreate) -> Account:
    """Create a new account for the user."""
    account = Account(
        user_id=user_id,
        name=data.name,
        type=data.type,
        balance=data.balance,
        currency=data.currency
    )

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def get_accounts(db: Session, user_id: str, active_only: bool = True) -> List[Account]:
    """Get all accounts for the user."""
    query = db.query(Account).filter(Account.user_id == user_id)

    if active_only:
        query = query.filter(Account.is_active == True)

    return query.all()


def get_account(db: Session, user_id: str, account_id: str) -> Account:
    """Get a specific account."""
    account = db.query(Account).filter(
        Account.id == account_id,
        Account.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    return account


def update_account(db: Session, user_id: str, account_id: str, data: AccountUpdate) -> Account:
    """Update an account."""
    account = get_account(db, user_id, account_id)

    # Update fields
    if data.name is not None:
        account.name = data.name
    if data.type is not None:
        account.type = data.type
    if data.balance is not None:
        account.balance = data.balance
    if data.currency is not None:
        account.currency = data.currency
    if data.is_active is not None:
        account.is_active = data.is_active

    db.commit()
    db.refresh(account)
    return account


def delete_account(db: Session, user_id: str, account_id: str):
    """Delete an account."""
    account = get_account(db, user_id, account_id)

    db.delete(account)
    db.commit()
    return {"message": "Account deleted successfully"}


def get_total_balance(db: Session, user_id: str) -> float:
    """Get total balance across all active accounts."""
    from sqlalchemy import func

    total = db.query(func.sum(Account.balance)).filter(
        Account.user_id == user_id,
        Account.is_active == True
    ).scalar()

    return float(total) if total else 0.0
