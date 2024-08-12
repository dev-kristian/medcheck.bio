'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useCustomToast } from '@/hooks/useToast';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useCustomToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/auth-action`,
        handleCodeInApp: true,
      });
      showToast("Reset Link Sent", "Please check your email to reset your password.", "success");
    } catch (error) {
      console.error('Error sending password reset email:', error);
      showToast("Error", "Failed to send reset link. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Forgot Password 🔒</CardTitle>
        <CardDescription>
          Enter your email and we'll send you instructions to reset your password
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className='auth-input'
          />
          
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-700 rounded-xl"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Link href="/sign-in" className="font-medium text-teal-600 hover:text-teal-500">
          ← Back to login
        </Link>
      </CardFooter>
    </div>
  );
};

export default ForgotPasswordPage;
