'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency, getCurrentMonthYear } from '@/lib/formatters';
import {
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
} from 'react-icons/fi';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    } else if (!user.onboardingCompleted) {
      router.push('/onboarding');
    } else {
      fetchDashboardData();
    }
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.onboardingCompleted) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FiTrendingUp className="text-3xl" />
          Dashboard Overview
        </h1>
        <p className="text-purple-100 mt-1">
          Financial overview for {getCurrentMonthYear()}
        </p>
      </div>

      {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-100 flex-shrink-0">
                      <FiDollarSign className="text-xl text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 min-w-0">Total Balance</p>
                  </div>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 break-all min-w-0">
                    ${formatCurrency(dashboardData?.stats?.total_balance)}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
                      <FiArrowUp className="text-xl text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 min-w-0">Monthly Income</p>
                  </div>
                  <p className="text-xl lg:text-2xl font-bold text-green-600 break-all min-w-0">
                    ${formatCurrency(dashboardData?.stats?.monthly_income)}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
                      <FiArrowDown className="text-xl text-red-600" />
                    </div>
                    <p className="text-sm text-gray-600 min-w-0">Monthly Expenses</p>
                  </div>
                  <p className="text-xl lg:text-2xl font-bold text-red-600 break-all min-w-0">
                    ${formatCurrency(dashboardData?.stats?.monthly_expenses)}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      dashboardData?.stats?.savings_rate < 0 ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <FiTrendingUp className={`text-xl ${
                        dashboardData?.stats?.savings_rate < 0 ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-600 min-w-0">
                      {dashboardData?.stats?.savings_rate < 0 ? 'Deficit' : 'Savings Rate'}
                    </p>
                  </div>
                  <p className={`text-xl lg:text-2xl font-bold break-all min-w-0 ${
                    dashboardData?.stats?.savings_rate < 0 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {Math.abs(dashboardData?.stats?.savings_rate || 0).toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budget Overview */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Budget Overview</h3>
                    <Link
                      href="/dashboard/budgets"
                      className="text-sm text-purple-600 hover:underline font-medium"
                    >
                      Manage
                    </Link>
                  </div>

                  {dashboardData?.budgets && dashboardData.budgets.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.budgets.map((budget: any, index: number) => {
                        const percentage = budget.percentage || 0;
                        return (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">{budget.category_name}</span>
                              <span className="text-sm text-gray-600">
                                ${formatCurrency(budget.spent)} / ${formatCurrency(budget.amount)}
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  budget.is_over_budget
                                    ? 'bg-red-600'
                                    : percentage > 80
                                    ? 'bg-orange-600'
                                    : 'bg-green-600'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No budgets set. Click "Manage" to create your first budget!
                    </p>
                  )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Recent</h3>
                    <Link
                      href="/dashboard/transactions"
                      className="text-sm text-purple-600 hover:underline font-medium"
                    >
                      View All
                    </Link>
                  </div>

                  {dashboardData?.recent_transactions && dashboardData.recent_transactions.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recent_transactions.map((transaction: any) => (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                        >
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'income' ? (
                              <FiArrowUp className={`text-green-600`} />
                            ) : (
                              <FiArrowDown className={`text-red-600`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{transaction.category_name}</p>
                          </div>
                          <p className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No transactions yet. Add your first transaction!
                    </p>
                  )}
                </div>
              </div>

        </>
      )}
    </div>
  );
}
