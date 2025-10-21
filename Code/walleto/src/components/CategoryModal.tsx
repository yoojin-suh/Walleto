'use client';

import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const COLORS = [
  { name: 'Purple', value: 'purple' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Pink', value: 'pink' },
];

export default function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', color: 'purple', icon: '' });
  const [error, setError] = useState('');

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
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
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', color: 'purple', icon: '' });
        setEditingId(null);
        fetchCategories();
        onSave();
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
    setFormData({ name: category.name, color: category.color, icon: category.icon });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? This cannot be undone.')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/financial/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('walleto_token')}`,
        },
      });

      if (response.ok) {
        fetchCategories();
        onSave();
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Categories</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2 transition">
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Add/Edit Form */}
          <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h3>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                required
              />

              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              >
                {COLORS.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiPlus />
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', color: 'purple', icon: '' });
                }}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel editing
              </button>
            )}
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">Your Categories</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories yet. Add one above!</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full bg-${category.color}-600`}
                      style={{ backgroundColor: `var(--${category.color}-600, #9333ea)` }}
                    />
                    <span className="font-medium text-gray-800">{category.name}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
