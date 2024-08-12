'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useCustomToast } from '@/hooks/useToast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Loader from '@/components/Loader';
import { Eye, EyeOff } from 'lucide-react';

function AuthAction() {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mode, setMode] = useState('');
  const [oobCode, setOobCode] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useCustomToast();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (mode && oobCode) {
      setMode(mode);
      setOobCode(oobCode);
      if (mode === 'verifyEmail') {
        handleEmailVerification(oobCode);
      } else {
        setLoading(false);
      }
    } else {
      showToast("Invalid Link", "The link is invalid or has expired.", "error");
      router.push('/sign-in');
    }
  }, [searchParams, router, showToast]);

  const handleEmailVerification = async (oobCode) => {
    try {
      await applyActionCode(auth, oobCode);
      setVerificationStatus('success');
      showToast("Email Verified", "Your email has been successfully verified.", "success");
      setTimeout(() => router.push('/sign-in'), 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationStatus('error');
      showToast("Verification Failed", "Unable to verify your email. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Password Mismatch", "Passwords do not match.", "error");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      showToast("Password Reset", "Your password has been successfully reset.", "success");
      router.push('/sign-in');
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast("Error", "Failed to reset password. Please try again.", "error");
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (mode === 'verifyEmail') {
    return (
      <div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className='text-center'>
            {verificationStatus === 'success' 
              ? "Your email has been successfully verified. Redirecting to sign-in page..." 
              : verificationStatus === 'error'
              ? "Unable to verify your email. Please try again or contact support."
              : "Verifying your email..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === 'error' && (
            <Button onClick={() => router.push('/sign-in')} className="w-full bg-teal-500 hover:bg-teal-700 rounded-xl">
              Go to Sign In
            </Button>
          )}
        </CardContent>
      </div>
    );
  }

  if (mode === 'resetPassword') {
    return (
      <div>
        <CardHeader className="p-6 ">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Your new password must be different from previously used passwords
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-xl"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword ? <Eye className="h-5 w-5 text-gray-400" /> : <EyeOff className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-xl"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5 text-gray-400" /> : <EyeOff className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-700 text-white rounded-xl">
              Set New Password
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/sign-in" className="text-sm text-teal-500 hover:text-teal-600">
              ← Back to login
            </a>
          </div>
        </CardContent>
      </div>
    );
  }

  return null;
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthAction />
    </Suspense>
  );
}