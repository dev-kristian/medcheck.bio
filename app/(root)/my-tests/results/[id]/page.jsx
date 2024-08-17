'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import HeaderBox from "@/components/HeaderBox";
import { useTestContext } from '@/app/context/TestContext';
import { formatDate } from '@/lib/utils';
import BiomarkersTab from '@/components/resultsPage/BiomarkersTab';
import AnalysisTab from '@/components/resultsPage/AnalysisTab';
import RecommendationsTab from '@/components/resultsPage/RecommendationsTab';
import ModernTabs from '@/components/ModernTabs';

export default function TestResultPage() {
  const { id } = useParams();
  const { tests, loading } = useTestContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
    </div>;
  }

  const result = tests.find(test => test.id === id);

  if (!result) {
    return <div>Test not found</div>;
  }

  // Flatten the test data structure
  const testEntries = [];
  Object.entries(result).forEach(([testType, testTypeData]) => {
    if (Array.isArray(testTypeData)) {
      testTypeData.forEach(data => {
        testEntries.push({ testType, data });
      });
    }
  });

  const handleNext = () => {
    if (currentIndex < testEntries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const { testType, data } = testEntries[currentIndex];

  const tabsContent = [
    {
      label: "Biomarkers",
      content: <BiomarkersTab biomarkers={data.biomarkers} interpretations={data.interpretations} />
    },
    {
      label: "Analysis",
      content: <AnalysisTab 
        interpretations={data.interpretations}
        clinicalSignificance={data.clinical_significance}
        specialtyConsultations={data.specialty_consultations}
      />
    },
    {
      label: "Advice",
      content: <RecommendationsTab
        generalRecommendations={data.general_recommendations}
        dietaryRecommendations={data.dietary_recommendations}
      />
    }
  ];

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
        <ModernTabs tabs={tabsContent} />
      </div>
    </section>
  );
}
