'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiUpload, FiUser } from 'react-icons/fi';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: '',
    nickname: user?.firstName || '',
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
    }
  }, [user, router]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        username: formData.username,
        nickname: formData.nickname,
        profilePicture: profileImage || undefined,
        birthdate: formData.birthdate || undefined,
        secondaryEmail: formData.secondaryEmail || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        street: formData.street || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        country: formData.country || undefined,
        onboardingCompleted: true,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await updateProfile({ onboardingCompleted: true });
      router.push('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] bg-clip-text text-transparent mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Let's personalize your Walleto experience
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step 2 of 2</span>
            <span>Almost there!</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] w-full transition-all"></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <FiUser className="text-white text-5xl" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition"
                >
                  <FiUpload className="text-xl" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">Click the icon to upload a profile picture</p>
            </div>

            {/* Name Display (Read-only) */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-gray-900 font-semibold">{user.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-gray-900 font-semibold">{user.lastName}</p>
              </div>
              <p className="col-span-2 text-xs text-gray-500">
                Your name cannot be edited here
              </p>
            </div>

            {/* Username (Required) */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                placeholder="johndoe123"
              />
            </div>

            {/* Nickname (Required) */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                Nickname (Display Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                placeholder="John"
              />
              <p className="mt-1 text-xs text-gray-500">This will be shown on your dashboard</p>
            </div>

            {/* Optional Fields */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Information (Optional)
              </h3>

              <div className="space-y-4">
                {/* Birthdate */}
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Secondary Email */}
                <div>
                  <label htmlFor="secondaryEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Email
                  </label>
                  <input
                    type="email"
                    id="secondaryEmail"
                    name="secondaryEmail"
                    value={formData.secondaryEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="backup@example.com"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (US)
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="+1234567890"
                  />
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Address</label>

                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State (e.g., CA)"
                      maxLength={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
