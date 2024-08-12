//app/(auth)/email-verificaion/page.jsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { applyActionCode } from 'firebase/auth';
import { useCustomToast } from '@/hooks/useToast';
import Loader from '@/components/Loader';
import { auth } from '@/firebase/firebaseConfig';

function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
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
  }, [searchParams, showToast, verificationStatus]);

  if (verificationStatus === 'success') {
    return null;
  }

  return (
      <>
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
      </>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <EmailVerification />
    </Suspense>
  );
}