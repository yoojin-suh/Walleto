'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import OTPModal from '@/components/OTPModal';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verifiedOTP, setVerifiedOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.requestPasswordReset(email);
      setShowOTPModal(true);
      setStep('otp');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    // Just store the OTP and move to password step
    setVerifiedOTP(otp);
    setShowOTPModal(false);
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(email, verifiedOTP, newPassword);
      setStep('success');
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPResend = async () => {
    await api.resendOTP(email, 'password_reset');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/30 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <button
              onClick={() => router.push('/signin')}
              className="w-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <h1 className="text-4xl font-bold text-white mb-2">Walleto</h1>
            </Link>
            <p className="text-purple-100">Create your new password</p>
          </div>

          {/* Password Card */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/30">
            <div className="mb-6">
              <button
                onClick={() => setStep('email')}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <FiArrowLeft />
                Back
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h2>
            <p className="text-gray-600 mb-6">
              Enter your new password below.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="At least 8 characters"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white mb-2">Walleto</h1>
          </Link>
          <p className="text-purple-100">Reset your password</p>
        </div>

        {/* Reset Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/30">
          <div className="mb-6">
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              <FiArrowLeft />
              Back to Sign In
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a verification code to reset your password.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiMail />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={step !== 'email'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {step === 'email' && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Sending Code...' : 'Send Reset Code'}
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/signin" className="text-purple-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        email={email}
        purpose="password_reset"
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onClose={() => {
          setShowOTPModal(false);
          setStep('email');
        }}
      />
    </div>
  );
}
