// app/(welcome)/welcome/introduction/page.jsx

'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Introduction() {
  const [displayName, setDisplayName] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
  
    try {
      const idToken = await user.getIdToken();
      const data = {
        userId: user.uid,
        section: 1,
        isAdult,
      };
  
      // Only include displayName if it's different from the user's current displayName
      if (displayName !== user.displayName) {
        data.displayName = displayName;
      }
  
      const response = await fetch('/api/users/welcome', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        router.push('/welcome/general_information');
      } else {
        console.error('Failed to update introduction details');
      }
    } catch (error) {
      console.error("Error updating user profile", error);
    }
  };

  return (
    <>
      <CardHeader >
        <CardTitle className="text-2xl font-bold text-teal-800">Let's Get Acquainted</CardTitle>
        <CardDescription className="text-teal-600">How would you like us to address you?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-400">Your comfort is our priority. Feel free to use a name you're comfortable with.</p>
        <Input
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
      <CardFooter className="justify-between">
        <Button onClick={() => router.push('/welcome')} className="bg-gray-300 text-gray-700 hover:bg-gray-400">Back</Button>
        <Button onClick={handleSubmit} disabled={!displayName || !isAdult} className="bg-teal-500 hover:bg-teal-600">Continue</Button>
      </CardFooter>
    </>
  );
}
