// app/(auth)/sign-up/page.jsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { checkOrCreateUserProfile } from '@/lib/utils';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useCustomToast } from '@/hooks/useToast';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useCustomToast();

  const handleSubmit = async ({ email, password, confirmPassword, agreeToTerms }) => {
    if (!agreeToTerms) {
      showToast("Terms Agreement Required", "Please agree to the privacy policy and terms.", "warning");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Password Mismatch", "Passwords do not match.", "error");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await checkOrCreateUserProfile(userCredential.user);
      await sendEmailVerification(userCredential.user, {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/auth-action`,
        handleCodeInApp: true,
      });
      showToast("Sign Up Successful", "Verification email sent. Please check your inbox.", "success");
      router.push('/verify-email');
    } catch (error) {
      console.error('Error signing up:', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      showToast("Sign Up Failed", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Adventure starts here </CardTitle>
        <CardDescription className="text-center">
          Make your health management easy and fun!
        </CardDescription>
      </CardHeader>

      <CardContent>
      <AuthForm isSignUp={true} onSubmit={handleSubmit} />
      </CardContent>

      <CardFooter className="flex justify-center">
      <CardDescription className="mt-2 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-teal-600 hover:text-teal-500">
          Sign in instead
        </Link>
      </CardDescription>
      </CardFooter>
    </>
  );
}
