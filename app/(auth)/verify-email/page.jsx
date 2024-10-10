'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomToast } from '@/hooks/useToast';
import { getAuth, reload, sendEmailVerification } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Loader from '@/components/Loader';

export default function VerifyEmail() {
  // Initialize router for navigation
  const router = useRouter();
  // Custom hook for displaying toast notifications
  const { showToast } = useCustomToast();
  // State to manage loading status for email verification check
  const [loading, setLoading] = useState(false);
  // State to manage loading status for resending verification email
  const [resendLoading, setResendLoading] = useState(false);

  // Function to handle email verification check
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      // Reload the user to get the latest email verification status
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

  // Function to handle resending verification email
  const handleResendVerificationEmail = async () => {
    setResendLoading(true);
    try {
      const auth = getAuth();
      // Send a new verification email
      await sendEmailVerification(auth.currentUser, {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/auth-action`,
        handleCodeInApp: true,
      });
      showToast("Email Sent", "Verification email has been resent. Please check your inbox.", "success");
    } catch (error) {
      console.error('Error resending verification email:', error);
      showToast("Error", "Failed to resend verification email.", "error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
        <CardDescription className='text-center'>
          Account activation link sent to your email address.
          Please follow the link inside to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Button to check email verification status */}
        <Button
          onClick={handleRefresh}
          className="w-full bg-teal-500 hover:bg-teal-700 rounded-xl"
          disabled={loading}
        >
          {loading ? (
            <>
              Checking &nbsp; <Loader />
            </>
          ) : (
            'I have verified my email'
          )}
        </Button>
        {/* Button to resend verification email */}
        <Button
          onClick={handleResendVerificationEmail}
          className="w-full bg-gray-500 hover:bg-gray-700 rounded-xl"
          disabled={resendLoading}
        >
          {resendLoading ? (
            <>
              Sending &nbsp; <Loader />
            </>
          ) : (
            'Resend Verification Email'
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/sign-in" className="text-teal-600 hover:text-teal-800">
          ← Go back to sign in
        </Link>
      </CardFooter>
    </div>
  );
}