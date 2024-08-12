'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useCustomToast } from '@/hooks/useToast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Loader from '@/components/Loader'; // Assuming you have a Loader component

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oobCode, setOobCode] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useCustomToast();

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      showToast("Invalid Link", "The password reset link is invalid or has expired.", "error");
    }
  }, [searchParams, router, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Password Mismatch", "Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      showToast("Password Reset", "Your password has been successfully reset.", "success");
      router.push('/sign-in');
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast("Error", "Failed to reset password. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Reset Password 🔒</CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      
      <CardContent >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div >
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New password"
              className='focus-visible:ring-teal-500'
            />
          </div>
          <div>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              className='focus-visible:ring-teal-500'
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-700"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </div>
  );
};

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
