// app/(welcome)/welcome/introduction/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Loader from '@/components/Loader';

export default function Introduction() {
  const [displayName, setDisplayName] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const idToken = await user.getIdToken();
      const data = {
        userId: user.uid,
        displayName,
        isAdult,
      };

      const response = await fetch('/api/users/welcome/introduction', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/welcome/general-information');
      } else {
        console.error('Failed to update introduction details');
      }
    } catch (error) {
      console.error("Error updating user profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='md:p-6'>
      <CardHeader className="relative">
        <button 
          onClick={() => router.push('/welcome')} 
          className="absolute left-4 top-6 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
        >
          ← Back
        </button>
        <div className="text-center pt-4">
          <CardTitle className="text-2xl font-bold text-teal-800">Let's Get Acquainted</CardTitle>
          <CardDescription className="text-teal-600">How would you like us to address you?</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-400">Your comfort is our priority. Feel free to use a name you're comfortable with.</p>
        <input
          placeholder={user?.displayName || "Your preferred name"}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="auth-input"
        />
        <div className="flex items-center space-x-2">
          <input
            id="confirm-age"
            type="checkbox"
            name="confirm-age"
            checked={isAdult}
            onChange={() => setIsAdult(!isAdult)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded accent-teal-500"
          />
          <label htmlFor="confirm-age" className="ml-2 block text-sm text-gray-900">
            I confirm that I am at least 18 years old or I am the legal guardian of the user.
          </label>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!displayName || !isAdult || loading} 
          className="bg-teal-500 hover:bg-teal-700 rounded-xl"
        >
          {loading ? (
            <>
              Saving &nbsp; <Loader />
            </>
          ) : (
            <>
            Continue to General Info &nbsp; →
          </>
          )}
        </Button>
      </CardFooter>
    </div>
  );
}
