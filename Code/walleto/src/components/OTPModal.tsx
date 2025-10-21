'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX, FiMail } from 'react-icons/fi';

interface OTPModalProps {
  isOpen: boolean;
  email: string;
  purpose: 'signup' | 'signin' | 'password_reset';
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onClose: () => void;
}

export default function OTPModal({ isOpen, email, purpose, onVerify, onResend, onClose }: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(360); // 6 minutes
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setTimeLeft(360);
      setResendCooldown(0);
      // Auto-focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onVerify(otpCode);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      await onResend();
      setTimeLeft(360);
      setResendCooldown(30); // 30 second cooldown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          disabled={loading}
        >
          <FiX className="text-2xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-3xl text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 text-sm">
            We sent a 6-digit code to<br />
            <span className="font-semibold text-gray-800">{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mb-4">
          {timeLeft > 0 ? (
            <p className={`text-sm ${timeLeft < 60 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              Code expires in: <span className="font-mono">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="text-sm text-red-600 font-semibold">Code expired. Please request a new one.</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || timeLeft === 0}
          className="w-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={loading || resendCooldown > 0}
            className="text-purple-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline text-sm"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : 'Resend Code'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
