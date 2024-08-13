// components/AuthForm.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import Loader from '@/components/Loader';
import Image from 'next/image';
import { handleGoogleSignIn } from '@/lib/utils';
import { useCustomToast } from '@/hooks/useToast';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { useRouter } from 'next/navigation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

export default function AuthForm({ 
  isSignUp, 
  onSubmit, 
  onPasswordChange,
  onConfirmPasswordChange,
  onAgreeToTermsChange,
  isSubmitDisabled
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { showToast } = useCustomToast();
  const router = useRouter();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (onPasswordChange) {
      onPasswordChange(newPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (onConfirmPasswordChange) {
      onConfirmPasswordChange(newConfirmPassword);
    }
  };

  const handleAgreeToTermsChange = (e) => {
    const newAgreeToTerms = e.target.checked;
    setAgreeToTerms(newAgreeToTerms);
    if (onAgreeToTermsChange) {
      onAgreeToTermsChange(newAgreeToTerms);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, confirmPassword, rememberMe, agreeToTerms });
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
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="auth-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
          <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
              onClick={() => setShowPassword(!showPassword)}
              aria-label='show password'
            >
              {showPassword ? (
                <Eye className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {isSignUp && onPasswordChange && <PasswordStrengthIndicator password={password} />}
        </div>
        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="auth-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label='show password'
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {!isSignUp && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 accent-teal-500"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember Me
            </label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
              Forgot Password?
            </Link>
          </div>
        </div>
      )}

      {isSignUp && (
        <div className="flex items-center">
          <input
            id="agree-terms"
            name="agree-terms"
            type="checkbox"
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded accent-teal-500"
            checked={agreeToTerms}
            onChange={handleAgreeToTermsChange}
          />
          <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
            I agree to{' '}
            <a href="/privacy-policy" className="text-teal-600 hover:text-teal-500">
              privacy policy
            </a>{' '}
            &{' '}
            <a href="/terms" className="text-teal-600 hover:text-teal-500">
              terms
            </a>
          </label>
        </div>
      )}

      <div>
        <Button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          disabled={isSubmitDisabled}
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <Button
          onClick={onGoogleSignIn}
          className="w-full inline-flex align-center justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
        </Button>
      </div>
    </form>
  );
}