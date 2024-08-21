'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Loader from '@/components/Loader';
import StepForm from '@/components/StepForm';
import { useCustomToast } from '@/hooks/useToast';

const steps = [
  {
    title: 'Daily Sleep Pattern',
    description: 'On average, how many hours do you sleep per night?',
    fields: [
      { name: 'lessThan5', label: 'Less than 5 hours' },
      { name: '5to6', label: '5-6 hours' },
      { name: '6to7', label: '6-7 hours' },
      { name: '7to8', label: '7-8 hours' },
      { name: 'moreThan8', label: 'More than 8 hours' },
      { name: 'irregular', label: 'Irregular sleep pattern' },
    ],
  },
  {
    title: 'Dietary Habits',
    description: 'Which of the following best describes your eating habits?',
    fields: [
      { name: 'vegetarian', label: 'Vegetarian' },
      { name: 'vegan', label: 'Vegan' },
      { name: 'pescatarian', label: 'Pescatarian' },
      { name: 'flexitarian', label: 'Flexitarian' },
      { name: 'omnivore', label: 'Omnivore' },
      { name: 'keto', label: 'Ketogenic' },
    ],
  },
  {
    title: 'Physical Activity',
    description: 'How often do you engage in moderate to vigorous physical activity?',
    fields: [
      { name: 'never', label: 'Never' },
      { name: 'rarely', label: 'Rarely (Once a month or less)' },
      { name: 'occasionally', label: 'Occasionally (2-3 times a month)' },
      { name: 'weekly', label: 'Weekly (1-2 times a week)' },
      { name: 'frequently', label: 'Frequently (3-5 times a week)' },
      { name: 'daily', label: 'Daily or almost daily' },
    ],
  },
  {
    title: 'Smoking Habits',
    description: 'Which of the following best describes your smoking habits?',
    fields: [
      { name: 'never', label: 'Never smoked' },
      { name: 'former', label: 'Former smoker' },
      { name: 'occasional', label: 'Occasional smoker' },
      { name: 'light', label: 'Light smoker (1-9 cigarettes/day)' },
      { name: 'moderate', label: 'Moderate smoker (10-19 cigarettes/day)' },
      { name: 'heavy', label: 'Heavy smoker (20+ cigarettes/day)' },
    ],
  },
  {
    title: 'Alcohol Consumption',
    description: 'How would you describe your alcohol consumption?',
    fields: [
      { name: 'never', label: 'Never drink' },
      { name: 'rarely', label: 'Rarely (Special occasions only)' },
      { name: 'monthly', label: 'Monthly (1-3 times a month)' },
      { name: 'weekly', label: 'Weekly (1-2 times a week)' },
      { name: 'frequently', label: 'Frequently (3-4 times a week)' },
      { name: 'daily', label: 'Daily or almost daily' },
    ],
  },
];

export default function Lifestyle() {
  const { showToast } = useCustomToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    dailySleepPattern: {},
    dietaryHabits: {},
    physicalActivity: {},
    smokingHabits: {},
    alcoholConsumption: {},
  });
  const [customInputs, setCustomInputs] = useState({
    dietaryHabits: '',
  });
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialFormData = steps.reduce((acc, step, index) => {
      acc[Object.keys(formData)[index]] = step.fields.reduce((fieldAcc, field) => {
        fieldAcc[field.name] = false;
        return fieldAcc;
      }, {});
      return acc;
    }, {});
    setFormData(initialFormData);
  }, []);

  const handleCheckboxChange = (name) => {
    const currentStepKey = Object.keys(formData)[step];
    setFormData(prev => ({
      ...prev,
      [currentStepKey]: {
        ...Object.keys(prev[currentStepKey]).reduce((acc, key) => {
          acc[key] = key === name ? !prev[currentStepKey][key] : false;
          return acc;
        }, {})
      }
    }));
  };

  const handleCustomInputChange = (value) => {
    setCustomInputs(prev => ({ ...prev, dietaryHabits: value }));
  };

  const validateStep = () => {
    const currentStepKey = Object.keys(formData)[step];
    return Object.values(formData[currentStepKey]).some(Boolean) || 
           (currentStepKey === 'dietaryHabits' && customInputs.dietaryHabits);
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      showToast('Input Required', 'Please select an option or provide a custom input', 'warning');
      return;
    }

    if (!user) {
      showToast('Authentication Error', 'Please log in to submit your lifestyle information', 'error');
      return;
    }
    setLoading(true);

    try {
      const idToken = await user.getIdToken();
      const data = {
        userId: user.uid,
        ...Object.entries(formData).reduce((acc, [key, value]) => {
          if (key === 'dietaryHabits') {
            const selectedItems = Object.entries(value)
              .filter(([_, selected]) => selected)
              .map(([itemKey, _]) => steps[1].fields.find(field => field.name === itemKey).label);
            if (selectedItems.length > 0 || customInputs[key]) {
              acc[key] = selectedItems.join(', ');
              if (customInputs[key]) {
                acc[key] += acc[key] ? `, ${customInputs[key]}` : customInputs[key];
              }
            } else {
              acc[key] = 'Not specified';
            }
          } else {
            const selectedItem = Object.entries(value)
              .find(([_, selected]) => selected);
            const stepIndex = Object.keys(formData).indexOf(key);
            acc[key] = selectedItem 
              ? steps[stepIndex].fields.find(field => field.name === selectedItem[0]).label 
              : 'Not specified';
          }
          return acc;
        }, {}),
      };

      const response = await fetch('/api/users/welcome/lifestyle', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast('Success', 'Lifestyle information updated successfully', 'success');
        router.push('/');
      } else {
        const errorData = await response.json();
        showToast('Update Failed', `Failed to update lifestyle information: ${errorData.error}`, 'error');
      }
    } catch (error) {
      showToast('Error', 'An error occurred while updating your profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      showToast('Input Required', 'Please select an option or provide a custom input', 'warning');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.push('/welcome/medical_history');
    }
  };

  const currentStep = steps[step];
  const currentStepKey = Object.keys(formData)[step];

  return (
    <div className='md:p-6'>
      <CardHeader className="relative">
        <button 
          onClick={handleBack} 
          className="absolute left-4 top-6 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
        >
          ← Back
        </button>
        <div className="text-center pt-6">
          <CardTitle className="text-2xl font-bold text-teal-800">Lifestyle Information</CardTitle>
          <CardDescription className="text-teal-600">Please provide your lifestyle information</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <StepForm 
          title={currentStep.title}
          description={currentStep.description}
          fields={currentStep.fields}
          values={formData[currentStepKey]}
          handleChange={handleCheckboxChange}
          showFields={true}
          customInput={customInputs.dietaryHabits}
          handleCustomInputChange={handleCustomInputChange}
          isLifestyle={true}
          allowCustomInput={step === 1} 
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={step < steps.length - 1 ? handleNext : handleSubmit} 
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 rounded-xl"
        >
          {step < steps.length - 1 ? 'Next →' : loading ? (
            <>
              Completing &nbsp; <Loader />
            </>
          ) : (
            'Complete Profile'
          )}
        </Button>
      </CardFooter>
    </div>
  );
}
