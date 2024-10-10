'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useCustomToast } from '@/hooks/useToast';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Loader from '@/components/Loader';

const ForgotPasswordPage = () => {
  // State for email input and loading status
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom hook for showing toast notifications
  const { showToast } = useCustomToast();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email, {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/auth-action`,
        handleCodeInApp: true,
      });
      // Show success toast
      showToast("Reset Link Sent", "Please check your email to reset your password.", "success");
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // Show error toast
      showToast("Error", "Failed to send reset link. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Card Header */}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
        <CardDescription className='text-center'>
          Enter your email and we'll send you instructions to reset your password
        </CardDescription>
      </CardHeader>
      
      {/* Card Content */}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input field */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className='auth-input'
          />
          
          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-700 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                Sending &nbsp; <Loader />
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </CardContent>
      
      {/* Card Footer */}
      <CardFooter className="flex justify-center">
        <Link href="/sign-in" className="font-medium text-teal-600 hover:text-teal-500">
          ← Back to login
        </Link>
      </CardFooter>
    </div>
  );
};

export default ForgotPasswordPage;