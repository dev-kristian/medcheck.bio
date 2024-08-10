// app/my-tests/results/[id]/page.js
'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import HeaderBox from "@/components/HeaderBox"
import { useTestContext } from '@/app/contexts/TestContext'

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

  return (
    <section className='page'>
      <div className='test-result-content'>
          <Link href="/my-tests" className="back-link">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Tests
            </Button>
          </Link>
          <HeaderBox
            type="testResult"
            testType={result.testType}
            subtext="Detailed analysis of your test results"
          />
        
        <div className="test-result-box">
          <h2>Test Details</h2>
          <p><strong>Test Date:</strong> {result.date}</p>
          <p><strong>Additional Information:</strong> {result.additionalInfo}</p>
          
          <h2>Analysis</h2>
          <p>{result.analysis}</p>
        </div>
      </div>
    </section>
  )
}