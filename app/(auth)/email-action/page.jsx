'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useCustomToast } from '@/hooks/useToast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Loader from '@/components/Loader';

function EmailAction() {
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [actionCompleted, setActionCompleted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useCustomToast();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (!oobCode) {
      showToast("Invalid Link", "The action link is invalid or has expired.", "error");
      router.push('/sign-in');
      return;
    }

    const handleEmailVerification = async () => {
      try {
        await applyActionCode(auth, oobCode);
        showToast("Email Verified", "Your email has been successfully verified.", "success");
        setActionCompleted(true);
      } catch (error) {
        console.error('Error verifying email:', error);
        showToast("Verification Failed", "Unable to verify your email. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    const handlePasswordReset = async () => {
      try {
        await verifyPasswordResetCode(auth, oobCode);
        setLoading(false);
      } catch (error) {
        console.error('Error verifying password reset code:', error);
        showToast("Invalid Link", "The password reset link is invalid or has expired.", "error");
        router.push('/forgot-password');
      }
    };

    if (mode === 'verifyEmail') {
      handleEmailVerification();
    } else if (mode === 'resetPassword') {
      handlePasswordReset();
    } else {
      showToast("Invalid Action", "Unknown action requested.", "error");
      router.push('/sign-in');
    }
  }, [searchParams, router, showToast]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Password Mismatch", "Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    const oobCode = searchParams.get('oobCode');
    try {
      await confirmPasswordReset(auth, oobCode, password);
      showToast("Password Reset", "Your password has been successfully reset.", "success");
      setActionCompleted(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast("Error", "Failed to reset password. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (actionCompleted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Action Completed</CardTitle>
          <CardDescription>
            You can now close this page and return to the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/sign-in')} className="w-full">
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  const mode = searchParams.get('mode');

  if (mode === 'resetPassword') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password 🔒</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New password"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null;
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <EmailAction />
    </Suspense>
  );
}
