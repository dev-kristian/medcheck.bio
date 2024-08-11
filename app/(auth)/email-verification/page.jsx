'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode } from 'firebase/auth';
import { useCustomToast } from '@/hooks/useToast';
import Loader from '@/components/Loader';
import { auth } from '@/firebase/firebaseConfig';

function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useCustomToast();

  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    let isMounted = true;

    if (!oobCode) {
      setVerificationStatus('error');
      showToast("Verification Failed", "Invalid verification link.", "error");
      return;
    }

    const verifyEmail = async () => {
      if (verificationStatus !== 'verifying') return;

      try {
        await applyActionCode(auth, oobCode);
        if (isMounted) {
          setVerificationStatus('success');
          showToast("Email Verified", "Your email has been successfully verified.", "success");
          // Redirect immediately to welcome page
          router.push('/welcome');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        if (isMounted) {
          setVerificationStatus('error');
          showToast("Verification Failed", "Unable to verify your email. Please try again.", "error");
        }
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [searchParams, showToast, verificationStatus, router]);

  if (verificationStatus === 'success') {
    return null; // Return nothing as we're redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {verificationStatus === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader />
            <p className="mt-4">Verifying your email...</p>
          </div>
        )}
        {verificationStatus === 'error' && (
          <div>
            <p className="text-red-600">There was an error verifying your email.</p>
            <p className="mt-2">Please try clicking the link in your email again.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <EmailVerification />
    </Suspense>
  );
}