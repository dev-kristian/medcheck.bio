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
  // Initialize router for navigation
  const router = useRouter();
  // Custom hook for displaying toast notifications
  const { showToast } = useCustomToast();
  // State to manage loading status
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user's email is verified
      if (!user.emailVerified) {
        showToast("Email Not Verified", "Please verify your email to proceed.", "warning");
        router.push('/verify-email');
        return;
      }

      // Check or create user profile and get redirect path
      const redirectPath = await checkOrCreateUserProfile(user);
      showToast("Sign In Successful", "Welcome back!", "success");
      router.push(redirectPath);
    } catch (error) {
      console.error('Error signing in with email/password', error);
      // Get and display appropriate error message
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
        {/* AuthForm component for handling sign-in */}
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