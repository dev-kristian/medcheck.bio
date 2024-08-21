'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Loader from '@/components/Loader';
import * as z from 'zod';
import { useCustomToast } from '@/hooks/useToast';
import AgeGenderForm from '@/components/general_information/AgeGenderForm';
import HeightWeightForm from '@/components/general_information/HeightWeightForm';
import ModernTabs from '@/components/ModernTabs';
import { convertCmToFtIn, convertFtInToCm, convertKgToLb, convertLbToKg } from '@/lib/utils';

const ageSchema = z.preprocess((val) => (val === '' ? undefined : parseInt(val, 10)), z.number().min(18, 'Age must be at least 18').max(120, 'Age must be less than 120'));
const genderSchema = z.enum(['male', 'female', 'other'], {
  errorMap: () => ({ message: 'Please select a gender.' })
});

const heightSchemaMetric = z.object({
  cm: z.preprocess((val) => (val === '' ? undefined : parseInt(val, 10)), z.number().min(50, 'Height must be at least 50 cm').max(300, 'Height must be less than 300 cm'))
});

const heightSchemaImperial = z.object({
  ft: z.preprocess((val) => (val === '' ? undefined : parseInt(val, 10)), z.number().min(1, 'Height must be at least 1 ft').max(9, 'Height must be less than 9 ft')),
  in: z.preprocess((val) => (val === '' ? undefined : parseInt(val, 10)), z.number().min(0, 'Inches must be at least 0').max(11, 'Inches must be less than 12'))
});

const weightSchemaMetric = z.preprocess((val) => (val === '' ? undefined : parseInt(val, 10)), z.number().min(20, 'Weight must be at least 20 kg').max(300, 'Weight must be less than 300 kg'));
const weightSchemaImperial = z.preprocess((val) => (val === '' ? undefined : parseInt(val, 10)), z.number().min(44, 'Weight must be at least 44 lb').max(661, 'Weight must be less than 661 lb'));

export default function GeneralInformation() {
  
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [height, setHeight] = useState({ cm: '', ft: '', in: '' });
  const [weight, setWeight] = useState({ kg: '', lb: '' });
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showToast } = useCustomToast();

  const handleHeightChange = (field, value) => {
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(value) || value === '') {
      const updatedHeight = { ...height, [field]: value };
      
      if (activeTab === 0) {
        if (field === 'cm' && value) {
          const { ft, in: inches } = convertCmToFtIn(parseFloat(value));
          setHeight({ ...updatedHeight, ft: ft.toString(), in: inches.toString() });
        } else if (field === 'cm' && value === '') {
          setHeight({ cm: '', ft: '', in: '' });
        }
      } else {
        if (field === 'ft' || field === 'in') {
          if (updatedHeight.ft && updatedHeight.in) {
            const cm = convertFtInToCm(parseInt(updatedHeight.ft, 10), parseInt(updatedHeight.in, 10));
            setHeight({ ...updatedHeight, cm: cm.toString() });
          } else {
            setHeight({ ...updatedHeight, cm: '' });
          }
        }
      }
    }
  };
  
  const handleWeightChange = (value) => {
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(value) || value === '') {
      if (activeTab === 0) {
        const kg = value;
        const lb = kg ? convertKgToLb(parseFloat(kg)).toFixed(1) : '';
        setWeight({ kg, lb });
      } else {
        const lb = value;
        const kg = lb ? convertLbToKg(parseFloat(lb)).toFixed(1) : '';
        setWeight({ kg, lb });
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
  
    try {
      const idToken = await user.getIdToken();
      let heightData, weightData;
  
      if (activeTab === 0) {
        const heightValidation = heightSchemaMetric.safeParse(height);
        const weightValidation = weightSchemaMetric.safeParse(weight.kg);
  
        if (!heightValidation.success || !weightValidation.success) {
          showToast('Validation Error', 'Please enter a valid height and weight.', 'error');
          setLoading(false);
          return;
        }
  
        heightData = { cm: parseInt(height.cm) };
        weightData = { kg: parseInt(weight.kg) };
      } else {
        const heightValidation = heightSchemaImperial.safeParse(height);
        const weightValidation = weightSchemaImperial.safeParse(weight.lb);
  
        if (!heightValidation.success || !weightValidation.success) {
          showToast('Validation Error', 'Please enter a valid height and weight.', 'error');
          setLoading(false);
          return;
        }
  
        heightData = { ft: parseInt(height.ft), inch: parseInt(height.in) };
        weightData = { lb: parseInt(weight.lb) };
      }
  
      const data = {
        userId: user.uid,
        age: parseInt(age),
        gender,
        height: heightData,
        weight: weightData,
      };
  
      const response = await fetch('/api/users/welcome/general_information', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        router.push('/welcome/medical_history');
      } else {
        showToast('Error', 'Failed to update general information', 'error');
      }
    } catch (error) {
      showToast('Error', 'Error updating user profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const ageValidation = ageSchema.safeParse(age);
    const genderValidation = genderSchema.safeParse(gender);

    if (!ageValidation.success || !genderValidation.success) {
      showToast('Validation Error', 'Please enter a valid age (18-120) and select your gender.', 'error');
      return;
    }
    setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AgeGenderForm age={age} setAge={setAge} gender={gender} setGender={setGender} />;
      case 2:
        return (
          <div className="space-y-6">
            <ModernTabs
              tabs={[
                {
                  label: 'Metric',
                  content: (
                    <HeightWeightForm
                      height={height}
                      setHeight={setHeight}
                      weight={weight}
                      setWeight={setWeight}
                      activeTab={activeTab}
                      handleHeightChange={handleHeightChange}
                      handleWeightChange={handleWeightChange}
                    />
                  ),
                },
                {
                  label: 'Imperial',
                  content: (
                    <HeightWeightForm
                      height={height}
                      setHeight={setHeight}
                      weight={weight}
                      setWeight={setWeight}
                      activeTab={activeTab}
                      handleHeightChange={handleHeightChange}
                      handleWeightChange={handleWeightChange}
                    />
                  ),
                },
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="md:p-6">
      <CardHeader className="relative">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/welcome/introduction')} 
          className="absolute left-4 top-6 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
        >
          ← Back
        </button>
        <div className="text-center pt-4">
          <CardTitle className="text-2xl font-bold text-teal-800">General Information</CardTitle>
          <CardDescription className="text-teal-600">Help us understand your physical characteristics</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={() => step < 2 ? handleNext() : handleSubmit()} 
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 rounded-xl"
        >
          {step < 2 ? 'Next →' : loading ? (
            <>
              Saving &nbsp; <Loader />
            </>
          ) : (
            <>
            Continue to Medical History&nbsp; →
          </>
          )}
        </Button>
      </CardFooter>
    </div>
  );
}

