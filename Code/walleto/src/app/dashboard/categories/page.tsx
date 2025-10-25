'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  type: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'expense' });
  const [error, setError] = useState('');

  // Suggested category names
  const expenseSuggestions = ['Groceries', 'Transportation', 'Utilities'];
  const incomeSuggestions = ['Salary', 'Freelance', 'Investment'];

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/financial/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('walleto_token')}`,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = editingId
        ? `http://localhost:8000/api/financial/categories/${editingId}`
        : 'http://localhost:8000/api/financial/categories';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('walleto_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', type: 'expense' });
        setEditingId(null);
        fetchCategories();
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to save category');
      }
    } catch (err) {
      setError('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, type: category.type || 'expense' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? This cannot be undone.')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/financial/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('walleto_token')}`,
        },
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-purple-100 mt-1">
          Organize your transactions with custom categories
        </p>
      </div>

      <div className="max-w-4xl">
        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h3>

          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, name: '' })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <input
                type="text"
                placeholder="Category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                <FiPlus />
                {editingId ? 'Update' : 'Add Category'}
              </button>
            </div>

            {/* Suggestions chips */}
            {!editingId && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Quick add:</span>
                {(formData.type === 'expense' ? expenseSuggestions : incomeSuggestions).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setFormData({ ...formData, name: suggestion })}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full hover:bg-purple-100 transition border border-purple-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', type: 'expense' });
              }}
              className="mt-3 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel editing
            </button>
          )}
        </form>

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center justify-between">
            <span>Your Categories</span>
            <span className="text-sm font-normal text-gray-500">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </span>
          </h3>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <FiPlus className="text-5xl mx-auto mb-2" />
              </div>
              <p className="text-gray-500 font-medium">No categories yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first category above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    {category.type === 'income' ? (
                      <FiArrowUp className="text-green-600 text-lg" />
                    ) : (
                      <FiArrowDown className="text-red-600 text-lg" />
                    )}
                    <span className="font-medium text-gray-800">{category.name}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit category"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete category"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
