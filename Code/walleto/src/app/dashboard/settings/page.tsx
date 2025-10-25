'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { FiUpload } from 'react-icons/fi';
import PasswordChangeModal from '@/components/PasswordChangeModal';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePicture || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    nickname: user?.nickname || '',
    birthdate: user?.birthdate || '',
    secondaryEmail: user?.secondaryEmail || '',
    phoneNumber: user?.phoneNumber || '',
    street: user?.street || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'USA',
  });

  const displayName = user?.nickname || user?.firstName || 'User';

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

  if (!user) return null;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and security settings</p>
      </div>

      {/* Profile Settings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
                <p className="font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Email
                </label>
                <input
                  type="email"
                  value={profileData.secondaryEmail}
                  onChange={(e) =>
                    setProfileData({ ...profileData, secondaryEmail: e.target.value })
                  }
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
      />
    </div>
  );
}
