// app/my-tests/page.js
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderBox from "@/components/HeaderBox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTestContext } from '@/app/context/TestContext';
import { formatDate } from '@/lib/utils'

const TESTS_PER_PAGE = 6;

export default function MyTestsPage() {
  const { tests, loading } = useTestContext();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
    </div>;
  }

  const handleRowClick = (id) => {
    router.push(`/my-tests/results/${id}`);
  };

  const totalPages = Math.ceil(tests.length / TESTS_PER_PAGE);
  const indexOfLastTest = currentPage * TESTS_PER_PAGE;
  const indexOfFirstTest = indexOfLastTest - TESTS_PER_PAGE;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'low': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <section className='page px-4 py-6  mx-auto'>
      <header className='my-tests-header mb-8'>
        <Link href="/" className="back-link">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <HeaderBox
          type="myTests"
          title="My Tests"
          subtext="View and manage your test results"
        />
      </header>

      {tests.length === 0 ? ( 
        <div className='flex items-center justify-center mt-12'>
          <div className="no-tests-message text-center rounded-3xl">
            <Image
              src="/images/empty.svg"
              alt="No tests"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">You haven't added any tests yet</h2>
            <p className="text-base text-gray-600 mb-6">
              Add a new test to start gaining valuable insights into your health.
            </p>
            <Link href='/my-tests/add-test'>
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1" size="lg">
                <Plus className="mr-2 h-5 w-5" /> Add new analysis
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="table-header flex justify-between items-center mb-6">
            <div className="table-actions flex space-x-4">
              <Button variant="outline" size="sm" className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Link href='/my-tests/add-test'>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add new analysis
                </Button>
              </Link>
            </div>
          </div>
          <div className="tests-table-container overflow-x-auto rounded-lg shadow-md">
            <Table>
              <TableHeader className='bg-gray-50'>
                <TableRow>
                  <TableHead className='text-sm font-semibold text-gray-700 py-3 px-4'>Date</TableHead>
                  <TableHead className='text-sm font-semibold text-gray-700 py-3 px-4'>Test Type</TableHead>
                  <TableHead className="hidden md:table-cell text-sm font-semibold text-gray-700 py-3 px-4">Clinical Significance</TableHead>
                  <TableHead className="hidden md:table-cell text-sm font-semibold text-gray-700 py-3 px-4">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTests.map((test, index) => (
                  <TableRow 
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    onClick={() => handleRowClick(test.id)}
                  >
                    <TableCell className="py-3 px-4">
                      <div className="max-h-24 overflow-y-auto">
                        {Object.values(test).map((testTypeData, idx) => (
                          Array.isArray(testTypeData) && testTypeData.map((data, dataIndex) => (
                            data.test_date && (
                              <div key={`date-${idx}-${dataIndex}`} className="text-sm text-gray-900">
                                {formatDate(data.test_date)}
                              </div>
                            )
                          ))
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="max-h-24 overflow-y-auto">
                        {Object.keys(test)
                          .filter(key => key !== 'id')
                          .map((testType, idx) => (
                            <div key={`type-${idx}`} className="text-sm text-gray-900 font-medium">
                              {testType}
                            </div>
                          ))
                        }
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-3 px-4">
                      <div className="max-h-24 overflow-y-auto">
                        {Object.values(test).map((testTypeData, idx) => (
                          Array.isArray(testTypeData) && testTypeData.map((data, dataIndex) => (
                            data.clinical_significance && data.clinical_significance.map((cs, csIndex) => (
                              <div key={`${idx}-${dataIndex}-${csIndex}`} className="text-sm text-gray-700">
                                {cs.name}
                              </div>
                            ))
                          ))
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-3 px-4">
                      <div className="max-h-24 overflow-y-auto">
                        {Object.values(test).map((testTypeData, idx) => (
                          Array.isArray(testTypeData) && testTypeData.map((data, dataIndex) => (
                            data.clinical_significance && data.clinical_significance.map((cs, csIndex) => (
                              <div 
                                key={`severity-${idx}-${dataIndex}-${csIndex}`} 
                                className={`${getSeverityColor(cs.severity)} text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}
                              >
                                {cs.severity}
                              </div>
                            ))
                          ))
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="pagination-container mt-6 flex justify-center items-center space-x-2">
              <Button 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}