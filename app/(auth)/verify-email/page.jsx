// app/(auth)/verify-email/page.jsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCustomToast } from '@/hooks/useToast';
import { getAuth, reload } from 'firebase/auth';

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
    <>
      <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
      <p className="mb-4">
        Account activation link sent to your email address:
        Please follow the link inside to continue.
      </p>
      <button
        onClick={handleRefresh}
        className="text-indigo-600 hover:text-indigo-800"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'I have verified my email'}
      </button>
      <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800 block mt-4">
        Go back to sign in
      </Link>
    </>
  );
}
