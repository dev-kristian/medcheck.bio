// app/my-tests/results/[id]/page.js
'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import HeaderBox from "@/components/HeaderBox"
import { useTestContext } from '@/app/context/TestContext'

export default function TestResultPage() {
  const { id } = useParams()
  const { tests, loading } = useTestContext()

  if (loading) {
    return <div>Loading...</div>
  }

  const result = tests.find(test => test.id === id)

  if (!result) {
    return <div>Test not found</div>
  }

  const renderBiomarkers = (biomarkers) => {
    return biomarkers.map((biomarker, index) => (
      <div key={index} className="biomarker">
        <p><strong>Name:</strong> {biomarker.name}</p>
        <p><strong>Long Name:</strong> {biomarker.long_name}</p>
        <p><strong>Value:</strong> {biomarker.value} {biomarker.unit}</p>
        <p><strong>Reference Range:</strong> {biomarker.reference_range}</p>
      </div>
    ));
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
            type="testResult"
            testType={Object.keys(result).filter(key => key !== 'id' && key !== 'date' && key !== 'createdAt').join(', ')}
            subtext="Detailed analysis of your test results"
          />
        </header>

        <div className="bg-white rounded-3xl md:shadow-xl p-2 md:p-6 mt-4">
          <h2>Test Details</h2>
          <p><strong>Test Date:</strong> {result.date}</p>
          <p><strong>Additional Information:</strong> {result.additionalInfo}</p>
          
          <h2>Analysis</h2>
          {Object.entries(result).map(([testType, testTypeData], index) => (
            Array.isArray(testTypeData) && testTypeData.map((data, dataIndex) => (
              <div key={`${index}-${dataIndex}`} className="test-type-section">
                <h3>{testType}</h3>
                {data.biomarkers && renderBiomarkers(data.biomarkers)}
              </div>
            ))
          ))}
        </div>
    </section>
  )
}
