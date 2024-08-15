// app/my-tests/page.js
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderBox from "@/components/HeaderBox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, FileText, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useTestContext } from '@/app/context/TestContext';

const TESTS_PER_PAGE = 6;

export default function MyTestsPage() {
  const { tests, loading } = useTestContext();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleRowClick = (id) => {
    router.push(`/my-tests/results/${id}`);
  };

  const totalPages = Math.ceil(tests.length / TESTS_PER_PAGE);
  const indexOfLastTest = currentPage * TESTS_PER_PAGE;
  const indexOfFirstTest = indexOfLastTest - TESTS_PER_PAGE;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className='page px-2'>
        <header className='my-tests-header'>
          <Link href="/" className="back-link">
            <Button variant="ghost" size="sm">
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
          <div className='flex items-center justify-center'>
            <div className="no-tests-message ">
                <Image
                  src="/icons/my-tests.svg"
                  alt="No tests"
                  width={120}
                  height={120}
                  className="text-teal-500"
                />
              <h2 className="no-tests-title">You haven't added any tests yet</h2>
              <p className="text-base text-gray-600 mb-6">
                Add a new test to start gaining valuable insights into your health.
              </p>
              <Link href='/my-tests/add-test'>
                <Button className="w-full bg-teal-500 hover:bg-teal-700 rounded-xl" size="lg">
                  <Plus className="mr-2 h-4 w-4" /> Add new analysis
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h2 className="tests-history-title">Tests History</h2>
              <div className="table-actions">
                <Button variant="outline" size="sm" className="w-full rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Link href='/my-tests/add-test'>
                  <Button className="w-full bg-teal-500 hover:bg-teal-700 rounded-xl" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add new analysis
                  </Button>
                </Link>
              </div>
            </div>
            <div className="tests-table-container no-scrollbar  ">
              <Table>
                <TableHeader className='bg-teal-50 '>
                  <TableRow >
                    <TableHead className='text-gray.900'>ID</TableHead>
                    <TableHead className='text-gray.900'>Test Type</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray.900">Clinical Significance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTests.map((test, index) => (
                    <TableRow 
                      key={test.id} 
                      className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      onClick={() => handleRowClick(test.id)}
                    >
                      <TableCell>{test.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {Object.keys(test).filter(key => key !== 'id').join(', ')}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {Object.values(test).map((testTypeData, idx) => (
                          Array.isArray(testTypeData) && testTypeData.map((data, dataIndex) => (
                            data.clinical_significance && data.clinical_significance.map((cs, csIndex) => (
                              <div key={`${idx}-${dataIndex}-${csIndex}`}>
                                {cs.name}
                              </div>
                            ))
                          ))
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="pagination-container">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        className={`pagination-nav-button ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-teal-500'}`}
                      />
                    </PaginationItem>
                    {[...Array(totalPages).keys()].map((number) => (
                      <PaginationItem key={number + 1}>
                        <PaginationLink 
                          href="#" 
                          onClick={() => paginate(number + 1)}
                          className={`pagination-link ${currentPage === number + 1 ? 'bg-teal-50 border-teal-500 text-teal-600' : 'hover:text-teal-500'}`}
                          >
                          {number + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        className={`pagination-nav-button ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-teal-500'}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
    </section>
  );
}
