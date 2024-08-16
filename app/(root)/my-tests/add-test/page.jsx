// /my-tests/add-test/page.jsx

"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';
import HeaderBox from "@/components/HeaderBox";
import { useTestContext } from '@/app/context/TestContext';
import ImageUploader from '@/components/ImageUploader';
import AdditionalInfoInput from '@/components/AdditionalInfoInput';
import { useAuth } from '@/hooks/useAuth';

const AddTestPage = () => {
  const router = useRouter()
  const [images, setImages] = useState([])
  const [additionalInfo, setAdditionalInfo] = useState('')
  const { addTest } = useTestContext();
  const { user } = useAuth();

  const handleProcess = async () => {
    if (images.length === 0) {
      alert('Please fill in all required fields (date, and at least one image)');
      return;
    }
  
    try {
      const payload = {
        userId: user.uid,
        images: images.map(img => img.base64),
        additionalInfo: additionalInfo.trim(),
      };
  
      const idToken = await user.getIdToken();
      const response = await fetch('/api/process-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to process test');
      }
  
      const data = await response.json();
      
      const newTest = {
        id: data.data.id,
        ...data.data,
      };
  
      addTest(newTest);
      router.push(`/my-tests/results/${newTest.id}`);
  
    } catch (error) {
      console.error('Error processing test:', error);
    }
  };

  return (
    <section className='page px-2'>
      <header className='my-tests-header'>
          <Link href="/my-tests" className="back-link"> 
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Tests
            </Button>
          </Link>
        <HeaderBox
          type="addTest"
          title="Add New Test"
          subtext="Select and add a new test to your list"
        />
        </header>

        <section className="bg-white rounded-3xl md:shadow-xl p-2 md:p-6 space-y-6">
          <ImageUploader images={images} setImages={setImages} />
          <AdditionalInfoInput 
            additionalInfo={additionalInfo} 
            setAdditionalInfo={setAdditionalInfo} 
          />
          
          <footer className="mt-auto p-4 sm:p-6 bg-white flex justify-center items-center">
            <Button 
              onClick={handleProcess} 
              className="w-full md:w-1/4  bg-teal-500 hover:bg-teal-700 rounded-xl"
              disabled={images.length === 0}
            >
              Process Test
            </Button>
          </footer>
        </section>
    </section>
  );
}

export default AddTestPage;