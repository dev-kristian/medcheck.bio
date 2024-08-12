// app/(auth)/sign-up/page.jsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { checkOrCreateUserProfile, handleGoogleSignIn } from '@/lib/utils';
import { useCustomToast } from '@/hooks/useToast';
import Loader from '@/components/Loader';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';

export default function SignUp() {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const onGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const redirectPath = await handleGoogleSignIn();
      showToast("Google Sign In Successful", "Welcome back!", "success");
      router.push(redirectPath);
    } catch (error) {
      console.error('Error signing in with Google', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      showToast("Google Sign In Failed", errorMessage, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Adventure starts here 🚀</h2>
      <p className="mt-2 text-sm text-gray-600">
        Make your health management easy and fun!
      </p>
      <AuthForm isSignUp={true} onSubmit={handleSubmit} />
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={onGoogleSignIn}
            className="w-full inline-flex align-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader />
            ) : (
              <>
                <span> Continue with Google &nbsp;</span>
                <Image
                  src="icons/google.svg"
                  width={20}
                  height={20}
                  alt="Google logo"
                />
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-teal-600 hover:text-teal-500">
          Sign in instead
        </Link>
      </p>
    </>
  );
}
