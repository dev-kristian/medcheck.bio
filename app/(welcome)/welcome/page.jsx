//(welcome)/medical-details/page.jsx

'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

function MedicalDetails() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function checkProfileCompletion() {
      if (user) {
        try {
          const response = await fetch(`/api/users?userId=${user.uid}`);
          const data = await response.json();
          
          if (response.ok) {
            if (data.profileCompleted) {
              router.push('/');
            } else {
              setShowForm(true);
            }
          } else {
            console.error('Error checking profile completion:', data.error);
            setShowForm(true);
          }
        } catch (error) {
          console.error('Error checking profile completion:', error);
          setShowForm(true);
        }
      }
      setLoading(false);
    }

    checkProfileCompletion();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/users/welcome', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          age,
          gender,
          medicalHistory,
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to update medical details');
      }
    } catch (error) {
      console.error("Error updating user profile", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!showForm) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Complete Your Medical Profile</CardTitle>
          <CardDescription className="text-center">Please provide your medical information to help us serve you better.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                required
                className="w-full h-32"
                placeholder="Please provide any relevant medical history or conditions"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" onClick={handleSubmit} >Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default MedicalDetails;