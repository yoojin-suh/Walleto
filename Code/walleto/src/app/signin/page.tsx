'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import OTPModal from '@/components/OTPModal';
import { api } from '@/lib/api';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get saved device token if exists
      const deviceToken = localStorage.getItem('walleto_device_token');

      // Step 1: Validate password and check if device is trusted
      const response = await api.requestSigninOTP({
        email: formData.email,
        password: formData.password,
        device_token: deviceToken || undefined,
      });

      // If device is trusted, skip OTP and sign in directly
      if (response.skip_otp && response.access_token) {
        localStorage.setItem('walleto_token', response.access_token);

        // Refresh user state in AuthContext
        await refreshUser();

        // Fetch user data to check onboarding status
        const userData = await api.getCurrentUser();

        // Redirect based on onboarding status
        if (userData.onboarding_completed) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
        return;
      }

      // Device not trusted - show OTP modal
      setPendingEmail(formData.email);
      setShowOTPModal(true);
    } catch (error: any) {
      setError(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    if (!pendingEmail) return;

    // Step 2: Verify OTP and get token
    const response = await api.verifySigninOTP(pendingEmail, otp, rememberDevice);

    // Store access token
    localStorage.setItem('walleto_token', response.access_token);

    // Store device token if "remember device" was checked
    if (response.device_token) {
      localStorage.setItem('walleto_device_token', response.device_token);
    }

    // Refresh user state in AuthContext
    await refreshUser();

    // Fetch user data to check onboarding status
    const userData = await api.getCurrentUser();

    setShowOTPModal(false);

    // Redirect based on onboarding status
    if (userData.onboarding_completed) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

  const handleOTPResend = async () => {
    if (!pendingEmail) return;

    await api.resendOTP(pendingEmail, 'signin');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/onboarding');
    } catch (error: any) {
      setError(error.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white mb-2">Walleto</h1>
          </Link>
          <p className="text-purple-100">Welcome back! Sign in to continue</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberDevice"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="rememberDevice" className="ml-2 block text-sm text-gray-700">
                Remember this device for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-purple-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <p className="mt-6 text-center text-sm text-purple-100">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-white">
            Terms of Service
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        email={pendingEmail}
        purpose="signin"
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onClose={() => setShowOTPModal(false)}
      />
    </div>
  );
}
