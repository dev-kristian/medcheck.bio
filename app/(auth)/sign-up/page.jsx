'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { checkOrCreateUserProfile } from '@/lib/utils';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useCustomToast } from '@/hooks/useToast';
import { z } from 'zod';

// Updated validation schema
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { showToast } = useCustomToast();

  useEffect(() => {
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    const doPasswordsMatch = password === confirmPassword;
    setIsFormValid(isPasswordValid && doPasswordsMatch && agreeToTerms);
  }, [password, confirmPassword, agreeToTerms]);

  const handleSubmit = async (formData) => {
    try {
      // Validate the form data
      const validatedData = signUpSchema.parse(formData);

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, validatedData.email, validatedData.password);
      await checkOrCreateUserProfile(userCredential.user);
      await sendEmailVerification(userCredential.user, {
        url: `${process.env.NEXT_PRIVATE_APP_URL}/auth-action`,
        handleCodeInApp: true,
      });
      showToast("Sign Up Successful", "Verification email sent. Please check your inbox.", "success");
      router.push('/verify-email');
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        error.errors.forEach(err => {
          showToast("Validation Error", err.message, "error");
        });
      } else {
        // Handle Firebase errors
        const errorMessage = getFirebaseErrorMessage(error.code);
        showToast("Sign Up Failed", errorMessage, "error");
      }
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
        <AuthForm 
          isSignUp={true} 
          onSubmit={handleSubmit} 
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onAgreeToTermsChange={setAgreeToTerms}
          isSubmitDisabled={!isFormValid}
        />
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