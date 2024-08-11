// app/(auth)/email-verification/page.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, getAuth } from 'firebase/auth';
import { useCustomToast } from '@/hooks/useToast';
import Loader from '@/components/Loader';

export default function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useCustomToast();

  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    
    if (!oobCode) {
      setVerificationStatus('error');
      showToast("Verification Failed", "Invalid verification link.", "error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const auth = getAuth();
        await applyActionCode(auth, oobCode);
        setVerificationStatus('success');
        showToast("Email Verified", "Your email has been successfully verified.", "success");
        setTimeout(() => router.push('/'), 3000); // Redirect to home after 3 seconds
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('error');
        showToast("Verification Failed", "Unable to verify your email. Please try again.", "error");
      }
    };

    verifyEmail();
  }, [searchParams, showToast, router]);

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
        {verificationStatus === 'success' && (
          <div>
            <p className="text-green-600">Your email has been successfully verified!</p>
            <p className="mt-2">Redirecting you to the home page...</p>
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