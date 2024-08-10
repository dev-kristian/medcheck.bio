// /my-tests/add-test/page.jsx

"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';
import HeaderBox from "@/components/HeaderBox";
import { useTestContext } from '@/app/contexts/TestContext';
import TestTypeSelector from '@/components/TestTypeSelector';
import DateSelector from '@/components/DateSelector';
import ImageUploader from '@/components/ImageUploader';
import AdditionalInfoInput from '@/components/AdditionalInfoInput';

const AddTestPage = () => {
  const router = useRouter()
  const [date, setDate] = useState()
  const [images, setImages] = useState([])
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [testType, setTestType] = useState('')
  const { addTest } = useTestContext();

  const handleProcess = async () => {
    if (!testType || !date || images.length === 0) {
      alert('Please fill in all required fields (test type, date, and at least one image)');
      return;
    }
  
    try {
      const payload = {
        testType,
        date: format(date, "PPP"),
        images: images.map(img => img.base64),
        additionalInfo: additionalInfo.trim(),
      };
  
      const response = await fetch('/api/process-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to process test');
      }
  
      const data = await response.json();
      const resultId = Date.now().toString();
      
      const newTest = {
        id: resultId,
        testType,
        date: format(date, "PPP"),
        additionalInfo,
        analysis: data.analysis,
      };
  
      // Use the same resultId for both the storage key and the test object
      addTest(resultId, newTest);
      router.push(`/my-tests/results/${resultId}`);
  
    } catch (error) {
      console.error('Error processing test:', error);
    }
  }

  return (
    <main className='page'>
      <article className='add-test-content'>
        <nav>
          <Link href="/my-tests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Tests
            </Button>
          </Link>
        </nav>
        
        <HeaderBox
          type="addTest"
          title="Add New Test"
          subtext="Select and add a new test to your list"
        />
        
        <section className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <TestTypeSelector testType={testType} setTestType={setTestType} />
          <DateSelector date={date} setDate={setDate} />
          <ImageUploader images={images} setImages={setImages} />
          <AdditionalInfoInput 
            additionalInfo={additionalInfo} 
            setAdditionalInfo={setAdditionalInfo} 
          />
          
          <footer className="mt-auto p-4 sm:p-6 bg-white">
            <Button 
              onClick={handleProcess} 
              className="process-button"
              disabled={!testType || !date || images.length === 0}
            >
              Process Test
            </Button>
          </footer>
        </section>
      </article>
    </main>
  );
}

export default AddTestPage;