// app/(auth)/auth-action/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useCustomToast } from '@/hooks/useToast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Loader from '@/components/Loader';

export default function AuthAction() {
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      setLoading(false);
    } else {
      showToast("Invalid Link", "The link is invalid or has expired.", "error");
      router.push('/sign-in');
    }
  }, [searchParams, router, showToast]);

  const handleEmailVerification = async () => {
    try {
      await applyActionCode(auth, oobCode);
      showToast("Email Verified", "Your email has been successfully verified.", "success");
      router.push('/sign-in');
    } catch (error) {
      console.error('Error verifying email:', error);
      showToast("Verification Failed", "Unable to verify your email. Please try again.", "error");
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

  if (loading) {
    return <Loader />;
  }

  if (mode === 'verifyEmail') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
          <CardDescription>Click the button below to verify your email</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleEmailVerification} className="w-full">
            Verify Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'resetPassword') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
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
