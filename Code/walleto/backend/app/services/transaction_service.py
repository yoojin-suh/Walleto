from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from fastapi import HTTPException, status
from app.models.transaction import Transaction
from app.models.account import Account
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionWithDetails
from typing import List, Optional
from datetime import datetime


def create_transaction(db: Session, user_id: str, data: TransactionCreate) -> Transaction:
    """Create a new transaction and update account balance."""
    # Validate account belongs to user if provided
    if data.account_id:
        account = db.query(Account).filter(
            Account.id == data.account_id,
            Account.user_id == user_id
        ).first()

        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found"
            )

        # Update account balance
        if data.type == "income":
            account.balance += data.amount
        else:  # expense
            account.balance -= data.amount

    # Validate category belongs to user if provided
    if data.category_id:
        category = db.query(Category).filter(
            Category.id == data.category_id,
            Category.user_id == user_id
        ).first()

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )

    transaction = Transaction(
        user_id=user_id,
        account_id=data.account_id,
        category_id=data.category_id,
        type=data.type,
        amount=data.amount,
        description=data.description,
        notes=data.notes,
        transaction_date=data.transaction_date or datetime.now()
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transactions(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    category_id: Optional[str] = None,
    account_id: Optional[str] = None
) -> List[TransactionWithDetails]:
    """Get transactions with filters."""
    query = db.query(
        Transaction,
        Category.name.label("category_name"),
        Category.color.label("category_color"),
        Category.icon.label("category_icon"),
        Account.name.label("account_name")
    ).outerjoin(
        Category, Transaction.category_id == Category.id
    ).outerjoin(
        Account, Transaction.account_id == Account.id
    ).filter(
        Transaction.user_id == user_id
    )

    if type:
        query = query.filter(Transaction.type == type)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if account_id:
        query = query.filter(Transaction.account_id == account_id)

    results = query.order_by(Transaction.transaction_date.desc()).offset(skip).limit(limit).all()

    # Convert to TransactionWithDetails
    transactions = []
    for trans, cat_name, cat_color, cat_icon, acc_name in results:
        trans_dict = {
            "id": trans.id,
            "user_id": trans.user_id,
            "account_id": trans.account_id,
            "category_id": trans.category_id,
            "type": trans.type,
            "amount": trans.amount,
            "description": trans.description,
            "notes": trans.notes,
            "transaction_date": trans.transaction_date,
            "created_at": trans.created_at,
            "updated_at": trans.updated_at,
            "category_name": cat_name,
            "category_color": cat_color,
            "category_icon": cat_icon,
            "account_name": acc_name
        }
        transactions.append(TransactionWithDetails(**trans_dict))

    return transactions


def get_transaction(db: Session, user_id: str, transaction_id: str) -> Transaction:
    """Get a specific transaction."""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == user_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    return transaction


def update_transaction(db: Session, user_id: str, transaction_id: str, data: TransactionUpdate) -> Transaction:
    """Update a transaction."""
    transaction = get_transaction(db, user_id, transaction_id)

    # If amount or type changes, need to adjust account balance
    if (data.amount and data.amount != transaction.amount) or (data.type and data.type != transaction.type):
        if transaction.account_id:
            account = db.query(Account).filter(Account.id == transaction.account_id).first()
            if account:
                # Reverse old transaction
                if transaction.type == "income":
                    account.balance -= transaction.amount
                else:
                    account.balance += transaction.amount

                # Apply new transaction
                new_amount = data.amount if data.amount else transaction.amount
                new_type = data.type if data.type else transaction.type

                if new_type == "income":
                    account.balance += new_amount
                else:
                    account.balance -= new_amount

    # Update fields
    if data.account_id is not None:
        transaction.account_id = data.account_id
    if data.category_id is not None:
        transaction.category_id = data.category_id
    if data.type is not None:
        transaction.type = data.type
    if data.amount is not None:
        transaction.amount = data.amount
    if data.description is not None:
        transaction.description = data.description
    if data.notes is not None:
        transaction.notes = data.notes
    if data.transaction_date is not None:
        transaction.transaction_date = data.transaction_date

    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, user_id: str, transaction_id: str):
    """Delete a transaction and adjust account balance."""
    transaction = get_transaction(db, user_id, transaction_id)

    # Adjust account balance
    if transaction.account_id:
        account = db.query(Account).filter(Account.id == transaction.account_id).first()
        if account:
            if transaction.type == "income":
                account.balance -= transaction.amount
            else:
                account.balance += transaction.amount

    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}


def get_monthly_summary(db: Session, user_id: str, month: int, year: int):
    """Get income and expense summary for a month."""
    income = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == user_id,
            Transaction.type == "income",
            extract('month', Transaction.transaction_date) == month,
            extract('year', Transaction.transaction_date) == year
        )
    ).scalar() or 0.0

    expenses = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            extract('month', Transaction.transaction_date) == month,
            extract('year', Transaction.transaction_date) == year
        )
    ).scalar() or 0.0

    return {
        "month": month,
        "year": year,
        "income": float(income),
        "expenses": float(expenses),
        "net": float(income - expenses)
    }
