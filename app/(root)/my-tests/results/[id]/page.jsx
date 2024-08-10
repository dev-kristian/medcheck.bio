"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import HeaderBox from "@/components/HeaderBox"

const TestResultPage = () => {
  const { id } = useParams()
  const [result, setResult] = useState(null)

  useEffect(() => {
    const storedResult = localStorage.getItem(`testResult_${id}`)
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    }
  }, [id])

  if (!result) {
    return <div>Loading...</div>
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

export default TestResultPage