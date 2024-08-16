'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from 'lucide-react'
import HeaderBox from "@/components/HeaderBox"
import { useTestContext } from '@/app/context/TestContext'
import { formatDate } from '@/lib/utils'
import BiomarkersTab from '@/components/BiomarkersTab'  

export default function TestResultPage() {
  const { id } = useParams()
  const { tests, loading } = useTestContext()
  const [currentIndex, setCurrentIndex] = useState(0)

  if (loading) {
    return <div>Loading...</div>
  }

  const result = tests.find(test => test.id === id)

  if (!result) {
    return <div>Test not found</div>
  }

  // Flatten the test data structure
  const testEntries = []
  Object.entries(result).forEach(([testType, testTypeData]) => {
    if (Array.isArray(testTypeData)) {
      testTypeData.forEach(data => {
        testEntries.push({ testType, data })
      })
    }
  })

  const renderClinicalSignificance = (clinicalSignificance) => {
    return clinicalSignificance.map((item, index) => (
      <div key={index} className="clinical-significance mb-2">
        <p><strong>{item.name}:</strong> {item.reason}</p>
      </div>
    ));
  };

  const renderDietaryRecommendations = (dietaryRecommendations) => {
    return dietaryRecommendations.map((item, index) => (
      <div key={index} className="dietary-recommendations mb-4">
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
        <ul className="list-disc pl-5 mt-2">
          {item.foods.map((food, foodIndex) => (
            <li key={foodIndex}>{food.name} <span className="text-gray-500">({food.type})</span></li>
          ))}
        </ul>
      </div>
    ));
  };

  const renderGeneralRecommendations = (generalRecommendations) => {
    return generalRecommendations.map((item, index) => (
      <div key={index} className="general-recommendations mb-2">
        <p><strong>{item.name}:</strong> {item.reason}</p>
      </div>
    ));
  };

  const renderInterpretations = (interpretations) => {
    return interpretations.map((item, index) => (
      <div key={index} className="interpretations mb-2">
        <p><strong>{item.name}:</strong> {item.interpretation}</p>
      </div>
    ));
  };

  const renderSpecialtyConsultations = (specialtyConsultations) => {
    return specialtyConsultations.map((item, index) => (
      <div key={index} className="specialty-consultations mb-2">
        <p><strong>{item.name}:</strong> {item.reason}</p>
      </div>
    ));
  };

  const handleNext = () => {
    if (currentIndex < testEntries.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const { testType, data } = testEntries[currentIndex]

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

      <div className="bg-white rounded-3xl shadow-xl py-2 px-4 md:p-6 mt-4">
        <p>{formatDate(data.test_date)}</p>
        <p><strong>{testType}</strong></p>
      </div>

      <div className="bg-white rounded-3xl md:shadow-xl p-2 md:p-6 mt-4">
      <div className="navigation-buttons mb-4 flex justify-between ">
          <Button variant="outline" size="sm" className='rounded-xl' onClick={handleBack} disabled={currentIndex === 0}>
            Previous Test
          </Button>
          <Button variant="outline" size="sm" className='rounded-xl' onClick={handleNext} disabled={currentIndex === testEntries.length - 1}>
            Next Test
          </Button>
        </div>
        <Tabs defaultValue="biomarkers" className="w-full">
          <TabsList className="flex justify-center p-1 mb-6 bg-gray-100 rounded-full">
            <TabsTrigger value="biomarkers" className="flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm rounded-full transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Biomarkers
            </TabsTrigger>
            <TabsTrigger value="interpretations" className="flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm rounded-full transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm rounded-full transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Advice
            </TabsTrigger>
          </TabsList>
          <TabsContent value="biomarkers" className="mt-4">
            <BiomarkersTab biomarkers={data.biomarkers} interpretations={data.interpretations} />
          </TabsContent>
          <TabsContent value="interpretations" className="mt-4">
            <h4 className="font-semibold mt-2 mb-1">Interpretations</h4>
            {data.interpretations && renderInterpretations(data.interpretations)}
            <h4 className="font-semibold mt-4 mb-1">Clinical Significance</h4>
            {data.clinical_significance && renderClinicalSignificance(data.clinical_significance)}
            <h4 className="font-semibold mt-4 mb-1">Specialty Consultations</h4>
            {data.specialty_consultations && renderSpecialtyConsultations(data.specialty_consultations)}
          </TabsContent>
          <TabsContent value="recommendations" className="mt-4">
            <h4 className="font-semibold mt-2 mb-1">General Recommendations</h4>
            {data.general_recommendations && renderGeneralRecommendations(data.general_recommendations)}
            <h4 className="font-semibold mt-4 mb-1">Dietary Recommendations</h4>
            {data.dietary_recommendations && renderDietaryRecommendations(data.dietary_recommendations)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}