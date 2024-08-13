// app/(welcome)/welcome/medical_history/page.jsx

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function MedicalHistory() {
  const [conditions, setConditions] = useState({
    diabetes: false,
    heartDisease: false,
    hypertension: false,
    cancer: false,
    asthma: false,
    // Add more conditions as needed
  });
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;

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
              <Checkbox
                id={condition}
                checked={value}
                onCheckedChange={(checked) => setConditions(prev => ({ ...prev, [condition]: checked }))}
              />
              <Label htmlFor={condition} className="text-teal-700">
                {condition.charAt(0).toUpperCase() + condition.slice(1).replace(/([A-Z])/g, ' $1')}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          onClick={() => router.push('/welcome/general_information')} 
          className="bg-gray-300 text-gray-700 hover:bg-gray-400"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-teal-500 hover:bg-teal-600"
        >
          Complete Profile
        </Button>
      </CardFooter>
    </>
  );
}
