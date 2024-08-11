'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, getAuth } from 'firebase/auth';
import { useCustomToast } from '@/hooks/useToast';

function VerifyEmailHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useCustomToast();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    if (!oobCode) {
      showToast('Error', 'Invalid verification link', 'error');
      router.push('/sign-in');
      return;
    }

    const verifyEmail = async () => {
      try {
        const auth = getAuth();
        await applyActionCode(auth, oobCode);
        showToast('Success', 'Email verified successfully', 'success');
        router.push('/welcome');
      } catch (error) {
        console.error('Error verifying email:', error);
        showToast('Error', 'Failed to verify email. Please try again.', 'error');
        router.push('/sign-in');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [router, searchParams, showToast]);

  if (verifying) {
    return <div>Verifying your email...</div>;
  }

  return null;
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailHandler />
    </Suspense>
  );
}
