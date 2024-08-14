// app/(auth)/sign-in/page.jsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { checkOrCreateUserProfile } from '@/lib/utils';
import { useCustomToast } from '@/hooks/useToast';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function SignIn() {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        showToast("Email Not Verified", "Please verify your email to proceed.", "warning");
        router.push('/verify-email');
        return;
      }

      const redirectPath = await checkOrCreateUserProfile(user);
      showToast("Sign In Successful", "Welcome back!", "success");
      router.push(redirectPath);
    } catch (error) {
      console.error('Error signing in with email/password', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      showToast("Sign In Failed", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome to Medcheck! </CardTitle>
        <CardDescription className="text-center">
        Please sign-in to your account and start the adventure
        </CardDescription>
      </CardHeader>
      <CardContent>
      <AuthForm isSignUp={false} onSubmit={handleSubmit} loading={loading}/>
      </CardContent>

      <CardFooter className="flex justify-center">
        <CardDescription className=" text-center text-sm text-gray-600">
          New on our platform?{' '}
          <Link href="/sign-up" className="font-medium text-teal-600 hover:text-teal-500">
            Create an account
          </Link>
        </CardDescription>
      </CardFooter>
    </>
  );
}