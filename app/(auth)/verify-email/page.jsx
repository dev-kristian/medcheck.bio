// app/(auth)/verify-email/page.jsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCustomToast } from '@/hooks/useToast';
import { getAuth, reload } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function VerifyEmail() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        showToast("Email Verified", "Your email has been verified.", "success");
        router.push('/welcome');
      } else {
        showToast("Email Not Verified", "Please verify your email to proceed.", "warning");
      }
    } catch (error) {
      console.error('Error refreshing email verification status:', error);
      showToast("Error", "Failed to refresh email verification status.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription>
          Account activation link sent to your email address.
          Please follow the link inside to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleRefresh}
          className="w-full bg-teal-500 hover:bg-teal-700"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'I have verified my email'}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/sign-in" className="text-teal-600 hover:text-teal-800">
          Go back to sign in
        </Link>
      </CardFooter>
    </div>
  );
}
