// app/(welcome)/welcome/general_information/page.jsx

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function GeneralInformation() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [menstrualCycle, setMenstrualCycle] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const data = {
        userId: user.uid,
        section: 2,
        age,
        gender,
        height,
        weight,
      };

      if (gender === 'female') {
        data.menstrualCycle = menstrualCycle;
      }

      const response = await fetch('/api/users/welcome', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/welcome/medical_history');
      } else {
        console.error('Failed to update general information');
      }
    } catch (error) {
      console.error("Error updating user profile", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="age" className="text-teal-700">Age</Label>
            <Input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full border-teal-300 focus:ring-teal-500"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-teal-700">Gender</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger className="w-full border-teal-300 focus:ring-teal-500">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {gender === 'female' && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="menstrualCycle" className="text-teal-700">Regularity of Menstrual Cycle</Label>
                <Select value={menstrualCycle} onValueChange={setMenstrualCycle} required>
                  <SelectTrigger className="w-full border-teal-300 focus:ring-teal-500">
                    <SelectValue placeholder="Select regularity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="not_applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-teal-700">Height (cm)</Label>
              <Input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                className="w-full border-teal-300 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-teal-700">Weight (kg)</Label>
              <Input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full border-teal-300 focus:ring-teal-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-teal-800">General Information</CardTitle>
        <CardDescription className="text-center text-teal-600">Help us understand your physical characteristics</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/welcome/introduction')} 
          className="bg-gray-300 text-gray-700 hover:bg-gray-400"
        >
          Back
        </Button>
        <Button 
          onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()} 
          className="bg-teal-500 hover:bg-teal-600"
        >
          {step < 3 ? 'Next' : 'Continue'}
        </Button>
      </CardFooter>
    </>
  );
}
