// (auth)/sign-up/page.jsx
'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { checkOrCreateUserProfile, handleGoogleSignIn } from '@/lib/utils';

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = async ({ email, password, confirmPassword, agreeToTerms }) => {
    if (!agreeToTerms) {
      alert("Please agree to the privacy policy and terms.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const redirectPath = await checkOrCreateUserProfile(userCredential.user);
      router.push(redirectPath);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      const redirectPath = await handleGoogleSignIn();
      router.push(redirectPath);
    } catch (error) {
      // Handle error (e.g., show error message to user)
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
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span> Continue with Google &nbsp;</span>
            <Image
              src="icons/google.svg"
              width={20}
              height={20}
              alt="Google logo"
            />
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
