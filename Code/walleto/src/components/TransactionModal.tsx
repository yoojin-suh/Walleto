'use client';

import { useState, useEffect } from 'react';
import { FiX, FiDollarSign, FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editTransaction?: any;
}

export default function TransactionModal({ isOpen, onClose, onSave, editTransaction }: TransactionModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category_id: '',
    account_id: '',
    notes: '',
    transaction_date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchAccounts();

      if (editTransaction) {
        setFormData({
          type: editTransaction.type,
          amount: editTransaction.amount.toString(),
          description: editTransaction.description,
          category_id: editTransaction.category_id || '',
          account_id: editTransaction.account_id || '',
          notes: editTransaction.notes || '',
          transaction_date: editTransaction.transaction_date.split('T')[0],
        });
      }
    }
  }, [isOpen, editTransaction]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/financial/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/financial/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = editTransaction
        ? `http://localhost:8000/api/financial/transactions/${editTransaction.id}`
        : 'http://localhost:8000/api/financial/transactions';

      const payload = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category_id: formData.category_id || null,
        account_id: formData.account_id || null,
        notes: formData.notes || null,
        transaction_date: new Date(formData.transaction_date).toISOString(),
      };

      const response = await fetch(url, {
        method: editTransaction ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({
          type: 'expense',
          amount: '',
          description: '',
          category_id: '',
          account_id: '',
          notes: '',
          transaction_date: new Date().toISOString().split('T')[0],
        });
        onSave();
        onClose();
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to save transaction');
      }
    } catch (err) {
      setError('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiDollarSign />
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2 transition">
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                  formData.type === 'income'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-600'
                }`}
              >
                <FiArrowUp />
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                  formData.type === 'expense'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-red-600'
                }`}
              >
                <FiArrowDown />
                Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <input
              type="text"
              placeholder="e.g., Grocery shopping"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
            <select
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">None</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : editTransaction ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
