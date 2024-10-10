'use client'

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Loader from '@/components/Loader';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useCustomToast } from '@/hooks/useToast';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

// Password validation schema using Zod
const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function AuthAction() {
  // State variables
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mode, setMode] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const verificationInitiated = useRef(false);
  const { showToast } = useCustomToast();

  // Effect to handle URL parameters and initiate verification
  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (mode && oobCode && !verificationInitiated.current) {
      setMode(mode);
      setOobCode(oobCode);
      verificationInitiated.current = true;
      if (mode === 'verifyEmail') {
        handleEmailVerification(oobCode);
      } else {
        setLoading(false);
      }
    } else if (!mode || !oobCode) {
      setVerificationStatus('invalid');
      setLoading(false);
    }
  }, [searchParams, router]);

  // Effect to validate password as user types
  useEffect(() => {
    try {
      passwordSchema.parse({ password, confirmPassword });
      setIsFormValid(true);
    } catch (error) {
      setIsFormValid(false);
    }
  }, [password, confirmPassword]);

  // Function to handle email verification
  const handleEmailVerification = async (oobCode) => {
    try {
      await applyActionCode(auth, oobCode);
      setVerificationStatus('success');
      setTimeout(() => router.push('/sign-in'), 3000);
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      passwordSchema.parse({ password, confirmPassword });
      await confirmPasswordReset(auth, oobCode, password);
      setVerificationStatus('passwordResetSuccess');
      showToast("Password Reset Successful", "Your password has been successfully reset.", "success");
      setTimeout(() => router.push('/sign-in'), 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          showToast("Validation Error", err.message, "error");
        });
      } else {
        setVerificationStatus('passwordResetError');
        showToast("Password Reset Failed", "An error occurred while resetting your password. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle password visibility
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
              : verificationStatus === 'invalid'
              ? "The link is invalid or has expired."
              : "Verifying your email..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === 'error' || verificationStatus === 'invalid' ? (
            <div className="mt-4 text-center">
              <a href="/sign-in" className="text-sm text-teal-500 hover:text-teal-600">
                ← Back to login
              </a>
          </div>
          ) : null}
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
              <PasswordStrengthIndicator password={password} />
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
            <Button 
              type="submit" 
              className="w-full bg-teal-500 hover:bg-teal-700 text-white rounded-xl" 
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  Setting Password &nbsp; <Loader />
                </>
              ) : (
                'Set New Password'
              )}
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

// Wrap AuthAction component with Suspense for better loading experience
export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthAction />
    </Suspense>
  );
}