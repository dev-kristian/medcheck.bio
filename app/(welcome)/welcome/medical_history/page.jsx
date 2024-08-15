'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Loader from '@/components/Loader';

export default function MedicalHistory() {
  const [conditions, setConditions] = useState({
    diabetes: false,
    heartDisease: false,
    hypertension: false,
    cancer: false,
    asthma: false,
  });
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (condition) => {
    setConditions(prev => ({ ...prev, [condition]: !prev[condition] }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/users/welcome', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          section: 3,
          medicalHistory: conditions,
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to update medical history');
      }
    } catch (error) {
      console.error("Error updating user profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-teal-800">Medical History</CardTitle>
        <CardDescription className="text-center text-teal-600">Please indicate any chronic or past health conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(conditions).map(([condition, value]) => (
            <div className="flex items-center space-x-2" key={condition}>
              <input
                id={condition}
                name="condition"
                checked={value}
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 accent-teal-500"
                onChange={() => handleCheckboxChange(condition)}
              />
              <label htmlFor={condition} className="ml-2 block text-sm text-gray-900">
                {condition.charAt(0).toUpperCase() + condition.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          onClick={() => router.push('/welcome/general_information')} 
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-xl"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 rounded-xl"
        >
          {loading ? (
            <>
              Completing &nbsp; <Loader />
            </>
          ) : (
            'Complete Profile'
          )}
        </Button>
      </CardFooter>
    </>
  );
}
