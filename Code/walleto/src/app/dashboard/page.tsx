'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  FiHome,
  FiPieChart,
  FiCreditCard,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiTag,
  FiTarget,
  FiUpload,
} from 'react-icons/fi';

import CategoryModal from '@/components/CategoryModal';
import BudgetModal from '@/components/BudgetModal';
import TransactionModal from '@/components/TransactionModal';
import PasswordChangeModal from '@/components/PasswordChangeModal';

export default function DashboardPage() {
  const { user, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    username: '',
    nickname: '',
    birthdate: '',
    secondaryEmail: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    } else if (!user.onboardingCompleted) {
      router.push('/onboarding');
    } else {
      fetchDashboardData();
      if (user) {
        setProfileData({
          username: user.username || '',
          nickname: user.nickname || '',
          birthdate: user.birthdate || '',
          secondaryEmail: user.secondaryEmail || '',
          phoneNumber: user.phoneNumber || '',
          street: user.street || '',
          city: user.city || '',
          state: user.state || '',
          zipCode: user.zipCode || '',
          country: user.country || 'USA',
        });
        setProfileImage(user.profilePicture || null);
      }
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

  const handleSignOut = () => {
    signOut();
    router.push('/signin');
  };

  const handleModalClose = () => {
    fetchDashboardData();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({
        username: profileData.username,
        nickname: profileData.nickname,
        profilePicture: profileImage || undefined,
        birthdate: profileData.birthdate || undefined,
        secondaryEmail: profileData.secondaryEmail || undefined,
        phoneNumber: profileData.phoneNumber || undefined,
        street: profileData.street || undefined,
        city: profileData.city || undefined,
        state: profileData.state || undefined,
        zipCode: profileData.zipCode || undefined,
        country: profileData.country || undefined,
      });
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  if (!user || !user.onboardingCompleted) {
    return null;
  }

  const displayName = user.nickname || user.firstName || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Walleto
            </h1>
            <p className="text-sm text-gray-500">Financial Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-purple-600 bg-purple-50 rounded-lg font-medium">
              <FiHome className="text-xl" />
              Dashboard
            </a>
            <button
              onClick={() => setShowTransactionModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FiDollarSign className="text-xl" />
              Transactions
            </button>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FiTag className="text-xl" />
              Categories
            </button>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FiTarget className="text-xl" />
              Budgets
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FiSettings className="text-xl" />
              Settings
            </button>
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
            >
              <FiLogOut />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          </div>

          <button
            onClick={() => setShowTransactionModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
          >
            <FiPlus />
            Add Transaction
          </button>
        </header>

        <main className="p-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <FiDollarSign className="text-2xl text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${dashboardData?.stats?.total_balance?.toFixed(2) || '0.00'}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <FiArrowUp className="text-2xl text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {dashboardData?.stats?.income_change > 0 ? '+' : ''}
                      {dashboardData?.stats?.income_change?.toFixed(1) || '0'}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${dashboardData?.stats?.monthly_income?.toFixed(2) || '0.00'}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-lg bg-red-100">
                      <FiArrowDown className="text-2xl text-red-600" />
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      {dashboardData?.stats?.expense_change > 0 ? '+' : ''}
                      {dashboardData?.stats?.expense_change?.toFixed(1) || '0'}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${dashboardData?.stats?.monthly_expenses?.toFixed(2) || '0.00'}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <FiTrendingUp className="text-2xl text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.stats?.savings_rate?.toFixed(0) || '0'}%
                  </p>
                </div>
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budget Overview */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Budget Overview</h3>
                    <button
                      onClick={() => setShowBudgetModal(true)}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Manage
                    </button>
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
                                ${budget.spent?.toFixed(2)} / ${budget.amount?.toFixed(2)}
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
                    <button
                      onClick={() => setShowTransactionModal(true)}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Add
                    </button>
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
                            {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
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

              {/* Settings Section */}
              {showSettings && (
                <>
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Settings</h3>

                  {!editingProfile ? (
                    <div className="space-y-4">
                      {/* Profile Picture */}
                      <div className="flex items-center gap-4 pb-4 border-b">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                          {user.profilePicture ? (
                            <Image
                              src={user.profilePicture}
                              alt="Profile"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      {/* Profile Info - 2 columns grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Username</label>
                          <p className="font-medium">{user.username || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Nickname</label>
                          <p className="font-medium">{user.nickname || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Birthdate</label>
                          <p className="font-medium">{user.birthdate || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Secondary Email</label>
                          <p className="font-medium">{user.secondaryEmail || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Phone Number</label>
                          <p className="font-medium">{user.phoneNumber || 'Not set'}</p>
                        </div>
                      </div>

                      {/* Address Section */}
                      {(user.street || user.city || user.state || user.zipCode || user.country) && (
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold text-gray-800 mb-3">Address</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.street && (
                              <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Street</label>
                                <p className="font-medium">{user.street}</p>
                              </div>
                            )}
                            {user.city && (
                              <div>
                                <label className="text-sm text-gray-600">City</label>
                                <p className="font-medium">{user.city}</p>
                              </div>
                            )}
                            {user.state && (
                              <div>
                                <label className="text-sm text-gray-600">State</label>
                                <p className="font-medium">{user.state}</p>
                              </div>
                            )}
                            {user.zipCode && (
                              <div>
                                <label className="text-sm text-gray-600">ZIP Code</label>
                                <p className="font-medium">{user.zipCode}</p>
                              </div>
                            )}
                            {user.country && (
                              <div>
                                <label className="text-sm text-gray-600">Country</label>
                                <p className="font-medium">{user.country}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setEditingProfile(true)}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        Edit Profile
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Profile Picture Upload */}
                      <div className="flex flex-col items-center mb-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden border-4 border-white shadow-lg">
                            {profileImage ? (
                              <Image
                                src={profileImage}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 shadow-lg text-white hover:bg-purple-700 transition"
                          >
                            <FiUpload />
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-2">Click to upload profile picture</p>
                      </div>

                      {/* Basic Profile Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                            placeholder="Enter username"
                          />
                        </div>

                        {/* Nickname */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                          <input
                            type="text"
                            value={profileData.nickname}
                            onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                            placeholder="Enter nickname"
                          />
                        </div>

                        {/* Birthdate */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                          <input
                            type="date"
                            value={profileData.birthdate}
                            onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                          />
                        </div>

                        {/* Secondary Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Email</label>
                          <input
                            type="email"
                            value={profileData.secondaryEmail}
                            onChange={(e) => setProfileData({ ...profileData, secondaryEmail: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                            placeholder="backup@example.com"
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-gray-800 mb-3">Address</h4>
                        <div className="space-y-3">
                          {/* Street */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input
                              type="text"
                              value={profileData.street}
                              onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                              placeholder="Street Address"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {/* City */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                              <input
                                type="text"
                                value={profileData.city}
                                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                                placeholder="City"
                              />
                            </div>

                            {/* State */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                              <input
                                type="text"
                                value={profileData.state}
                                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                                placeholder="State (e.g., CA)"
                                maxLength={2}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {/* ZIP Code */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                              <input
                                type="text"
                                value={profileData.zipCode}
                                onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                                placeholder="ZIP Code"
                              />
                            </div>

                            {/* Country */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                              <input
                                type="text"
                                value={profileData.country}
                                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                                placeholder="Country"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            setEditingProfile(false);
                            // Reset to original values
                            setProfileData({
                              username: user.username || '',
                              nickname: user.nickname || '',
                              birthdate: user.birthdate || '',
                              secondaryEmail: user.secondaryEmail || '',
                              phoneNumber: user.phoneNumber || '',
                              street: user.street || '',
                              city: user.city || '',
                              state: user.state || '',
                              zipCode: user.zipCode || '',
                              country: user.country || 'USA',
                            });
                            setProfileImage(user.profilePicture || null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileUpdate}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                  </div>

                  {/* Security Settings Section */}
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Security Settings</h3>

                    <div className="space-y-4">
                      {/* Password */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">Password</p>
                          <p className="text-sm text-gray-500">Change your account password</p>
                        </div>
                        <button
                          onClick={() => setShowPasswordChangeModal(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                          Change Password
                        </button>
                      </div>

                      {/* Two-Factor Authentication Info */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">OTP via email is enabled for all sign-ins</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleModalClose}
      />
      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSave={handleModalClose}
      />
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSave={handleModalClose}
      />
      <PasswordChangeModal
        isOpen={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
      />
    </div>
  );
}
