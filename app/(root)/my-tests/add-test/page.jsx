"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import CustomCalendar from "@/components/CustomCalendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, Upload, X } from 'lucide-react';
import HeaderBox from "@/components/HeaderBox";
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation';

const AddTestPage = () => {
  const router = useRouter()
  const [date, setDate] = useState()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [testType, setTestType] = useState('')

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleProcess = async () => {
    try {
      const response = await fetch('/api/process-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType,
          date: date ? format(date, "PPP") : '',
          additionalInfo,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to process test');
      }
  
      const data = await response.json();
      const resultId = Date.now().toString();
      
      localStorage.setItem(`testResult_${resultId}`, JSON.stringify({
        testType,
        date: date ? format(date, "PPP") : '',
        additionalInfo,
        analysis: data.analysis,
      }));
  
      router.push(`/my-tests/results/${resultId}`);

    } catch (error) {
      console.error('Error processing test:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }

  return (
    <section className='add-test-page'>
      <div className='add-test-content'>
          <Link href="/my-tests" className="mb-4">
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
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="space-y-4">
            <Select onValueChange={(value) => setTestType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectGroup>
                <SelectLabel>Tests</SelectLabel>
                <SelectItem value="blood-test">Blood Test</SelectItem>
                <SelectItem value="urine-test">Urine Test</SelectItem>
                <SelectItem value="sugar-test">Sugar Test</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select test date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CustomCalendar
                  selectedDate={date}
                  onDateSelect={setDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-6">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,image/*"
            />
            <label htmlFor="file-upload" className="file-upload-label">
              <Upload className="h-6 w-6 mr-2" />
              {file ? file.name : "Upload PDF or Image"}
            </label>
          </div>

          {preview && (
            <div className="image-preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
              <button onClick={removeFile} className="remove-file-button">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="additional-info" className="additional-info-label">Additional Information</label>
            <Textarea
              id="additional-info"
              placeholder="Enter any additional notes or information about the test..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="additional-info-textarea"
            />
          </div>
          <div className="mt-auto p-4 sm:p-6 bg-white">
            <Button 
              onClick={handleProcess} 
              className="process-button"
              disabled={!testType || !date}
            >
              Process Test
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddTestPage;