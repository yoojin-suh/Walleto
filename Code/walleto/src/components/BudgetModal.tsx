'use client';

import { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Budget {
  id: string;
  category_id: string;
  category_name: string;
  category_color: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  is_over_budget: boolean;
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function BudgetModal({ isOpen, onClose, onSave }: BudgetModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchBudgets();
    }
  }, [isOpen]);

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

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/financial/budgets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = editingId
        ? `http://localhost:8000/api/financial/budgets/${editingId}`
        : 'http://localhost:8000/api/financial/budgets';

      const payload = editingId
        ? { amount: parseFloat(formData.amount) }
        : {
            category_id: formData.category_id,
            amount: parseFloat(formData.amount),
            month: formData.month,
            year: formData.year,
            alert_threshold: 80,
          };

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({
          category_id: '',
          amount: '',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });
        setEditingId(null);
        fetchBudgets();
        onSave();
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to save budget');
      }
    } catch (err) {
      setError('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingId(budget.id);
    setFormData({
      category_id: budget.category_id,
      amount: budget.amount.toString(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this budget? This cannot be undone.')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/financial/budgets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
      });

      if (response.ok) {
        fetchBudgets();
        onSave();
      }
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Budgets</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2 transition">
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Add/Edit Form */}
          <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {editingId ? 'Edit Budget' : 'Set New Budget'}
            </h3>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {!editingId && (
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="number"
                placeholder="Budget amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                min="0"
                step="0.01"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {editingId ? 'Update' : 'Set Budget'}
              </button>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    category_id: '',
                    amount: '',
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                  });
                }}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel editing
              </button>
            )}
          </form>

          {/* Budgets List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Current Month Budgets</h3>
            {budgets.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No budgets set. Create categories first, then set budgets!
              </p>
            ) : (
              budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `var(--${budget.category_color}-600, #9333ea)` }}
                      />
                      <span className="font-semibold text-gray-800">{budget.category_name}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                      </span>
                      <span
                        className={`font-semibold ${
                          budget.is_over_budget ? 'text-red-600' : 'text-gray-700'
                        }`}
                      >
                        {budget.percentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          budget.is_over_budget
                            ? 'bg-red-600'
                            : budget.percentage > 80
                            ? 'bg-orange-600'
                            : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {budget.is_over_budget && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <FiAlertCircle />
                      <span>Over budget by ${(budget.spent - budget.amount).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
