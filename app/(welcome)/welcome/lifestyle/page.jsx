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
    description: 'How would you describe your daily sleep pattern?',
    fields: [
      { name: 'lessThan5', label: 'Less than 5 hours' },
      { name: '5to6', label: '5-6 hours' },
      { name: '6to7', label: '6-7 hours' },
      { name: '7to8', label: '7-8 hours' },
      { name: 'moreThan8', label: 'More than 8 hours' },
    ],
  },
  {
    title: 'Dietary Intake',
    description: 'How would you describe your dietary intake?',
    fields: [
      { name: 'vegetarian', label: 'Vegetarian' },
      { name: 'vegan', label: 'Vegan' },
      { name: 'pescatarian', label: 'Pescatarian' },
      { name: 'omnivore', label: 'Omnivore' },
      { name: 'other', label: 'Other' },
    ],
  },
  {
    title: 'Physical Activity',
    description: 'How often do you engage in physical activity?',
    fields: [
      { name: 'never', label: 'Never' },
      { name: 'rarely', label: 'Rarely' },
      { name: 'sometimes', label: 'Sometimes' },
      { name: 'often', label: 'Often' },
      { name: 'always', label: 'Always' },
    ],
  },
  {
    title: 'Smoking Habits',
    description: 'Do you smoke?',
    fields: [
      { name: 'never', label: 'Never' },
      { name: 'occasionally', label: 'Occasionally' },
      { name: 'regularly', label: 'Regularly' },
      { name: 'quit', label: 'Quit' },
      { name: 'other', label: 'Other' },
    ],
  },
  {
    title: 'Alcohol Consumption',
    description: 'How often do you consume alcohol?',
    fields: [
      { name: 'never', label: 'Never' },
      { name: 'occasionally', label: 'Occasionally'},
      { name: 'regularly', label: 'Regularly' },
      { name: 'frequently', label: 'Frequently' },
      { name: 'other', label: 'Other' },
    ],
  },
];

export default function Lifestyle() {
  const { showToast } = useCustomToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    dailySleepPattern: {},
    dietaryIntake: {},
    physicalActivity: {},
    smokingHabits: {},
    alcoholConsumption: {},
  });
  const [customInputs, setCustomInputs] = useState({
    dailySleepPattern: '',
    dietaryIntake: '',
    physicalActivity: '',
    smokingHabits: '',
    alcoholConsumption: '',
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
        ...prev[currentStepKey],
        [name]: !prev[currentStepKey][name]
      }
    }));
  };

  const handleCustomInputChange = (value) => {
    const currentStepKey = Object.keys(customInputs)[step];
    setCustomInputs(prev => ({ ...prev, [currentStepKey]: value }));
  };

  const handleSubmit = async () => {
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
          if (key === 'dietaryIntake') {
            const selectedItems = Object.entries(value)
              .filter(([_, selected]) => selected)
              .reduce((itemAcc, [itemKey, itemValue]) => ({ ...itemAcc, [itemKey]: itemValue }), {});
            if (Object.keys(selectedItems).length > 0 || customInputs[key]) {
              acc[key] = { ...selectedItems };
              if (customInputs[key]) {
                acc[key].custom = customInputs[key];
              }
            } else {
              acc[key] = false;
            }
          } else {
            const selectedItems = Object.entries(value)
              .filter(([_, selected]) => selected)
              .map(([itemKey, _]) => itemKey)
              .join(' ');
            acc[key] = selectedItems || false;
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
    if (!Object.values(formData[Object.keys(formData)[step]]).some(Boolean) && !      customInputs[Object.keys(customInputs)[step]]) {
      showToast('Input Required', 'Please select at least one option or provide a custom input', 'warning');
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
          customInput={customInputs[currentStepKey]}
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

