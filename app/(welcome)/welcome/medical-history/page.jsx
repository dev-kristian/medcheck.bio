// app/(welcome)/welcome/medical_history/page.jsx
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
    title: 'Allergies',
    description: 'Do you have any allergies? Select all that apply or specify any others.',
    fields: [
      { name: 'pollen', label: 'Pollen' },
      { name: 'dust', label: 'Dust Mites' },
      { name: 'peanuts', label: 'Peanuts' },
      { name: 'treeNuts', label: 'Tree Nuts' },
      { name: 'shellfish', label: 'Shellfish' },
      { name: 'lactose', label: 'Lactose' },
    ],
  },
  {
    title: 'Medications',
    description: 'Are you currently taking any medications? Select all that apply or add any others.',
    fields: [
      { name: 'lisinopril', label: 'Lisinopril' },
      { name: 'metformin', label: 'Metformin' },
      { name: 'levothyroxine', label: 'Levothyroxine' },
      { name: 'amlodipine', label: 'Amlodipine' },
      { name: 'omeprazole', label: 'Omeprazole' },
      { name: 'atorvastatin', label: 'Atorvastatin' },
    ],
  },
  {
    title: 'Medical Conditions',
    description: 'Do you have any ongoing medical conditions? Select all that apply or specify any others.',
    fields: [
      { name: 'diabetes', label: 'Diabetes' },
      { name: 'hypertension', label: 'Hypertension' },
      { name: 'asthma', label: 'Asthma' },
      { name: 'heartDisease', label: 'Heart Disease' },
      { name: 'arthritis', label: 'Arthritis' },
      { name: 'depression', label: 'Depression' },
    ],
  },
  {
    title: 'Surgeries',
    description: 'Have you had any surgeries in the past? Select all that apply or add any others.',
    fields: [
      { name: 'appendectomy', label: 'Appendectomy' },
      { name: 'tonsillectomy', label: 'Tonsillectomy' },
      { name: 'caesarean', label: 'Caesarean Section' },
      { name: 'kneeReplacement', label: 'Knee Replacement' },
      { name: 'hipReplacement', label: 'Hip Replacement' },
      { name: 'gallbladderRemoval', label: 'Gallbladder Removal' },
    ],
  },
  {
    title: 'Family History',
    description: 'Do any of these conditions run in your family? Select all that apply or specify any others.',
    fields: [
      { name: 'cancer', label: 'Cancer' },
      { name: 'heartDisease', label: 'Heart Disease' },
      { name: 'diabetes', label: 'Diabetes' },
      { name: 'highBloodPressure', label: 'High Blood Pressure' },
      { name: 'stroke', label: 'Stroke' },
      { name: 'mentalIllness', label: 'Mental Illness' },
    ],
  },
];

export default function MedicalHistory() {
  const { showToast } = useCustomToast();
  const [step, setStep] = useState(0);
  const [showFields, setShowFields] = useState(false);
  const [formData, setFormData] = useState({
    allergies: {},
    medications: {},
    medicalConditions: {},
    surgeries:{},
    familyHistory:{},
  });
  const [customInputs, setCustomInputs] = useState({
    allergies: '',
    medications: '',
    medicalConditions: '',
    surgeries:'',
    familyHistory:'',
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

  const handleYesNo = (response) => {
    setShowFields(response);
  };

  const handleSubmit = async () => {
    if (!user) {
      showToast('Authentication Error', 'Please log in to submit your medical history', 'error');
      return;
    }
    setLoading(true);
  
    try {
      const idToken = await user.getIdToken();
      const data = {
        userId: user.uid,
        ...Object.entries(formData).reduce((acc, [key, value]) => {
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
          
          return acc;
        }, {}),
      };
  
      const response = await fetch('/api/users/welcome/medical_history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        router.push('/welcome/lifestyle');
      } else {
        const errorData = await response.json();
        showToast('Update Failed', `Failed to update medical history: ${errorData.error}`, 'error');
      }
    } catch (error) {
      showToast('Error', 'An error occurred while updating your profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      if (showFields && !Object.values(formData[Object.keys(formData)[step]]).some(Boolean) && !customInputs[Object.keys(customInputs)[step]]) {
        showToast('Input Required', 'Please select at least one option or provide a custom input', 'warning');
        return;
      }
      setStep(step + 1);
      setShowFields(false);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setShowFields(false);
    } else {
      router.push('/welcome/general_information');
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
          <CardTitle className="text-2xl font-bold text-teal-800">Medical History</CardTitle>
          <CardDescription className="text-teal-600">Please provide your medical history</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <StepForm 
          title={currentStep.title}
          description={currentStep.description}
          fields={currentStep.fields}
          values={formData[currentStepKey]}
          handleChange={handleCheckboxChange}
          showFields={showFields}
          handleYesNo={handleYesNo}
          customInput={customInputs[currentStepKey]}
          handleCustomInputChange={handleCustomInputChange}
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={handleNext} 
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 rounded-xl"
        >
          {step < steps.length - 1 ? 'Next →' : loading ? (
            <>
              Saving &nbsp; <Loader />
            </>
          ) : (
            <>
            Continue to Lifestyle&nbsp; →
            </>
          )}
        </Button>
      </CardFooter>
    </div>
  );
}