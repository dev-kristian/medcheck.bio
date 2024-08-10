"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderBox from "@/components/HeaderBox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, FileText, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const TESTS_PER_PAGE = 8;

const MyTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    // Retrieve all test results from localStorage
    const allTests = Object.keys(localStorage)
      .filter(key => key.startsWith('testResult_'))
      .map(key => {
        const test = JSON.parse(localStorage.getItem(key));
        return { ...test, id: key.replace('testResult_', '') };
      });
    setTests(allTests);
  }, []);

  const handleRowClick = (id) => {
    router.push(`/my-tests/results/${id}`);
  };

  const totalPages = Math.ceil(tests.length / TESTS_PER_PAGE);
  const indexOfLastTest = currentPage * TESTS_PER_PAGE;
  const indexOfFirstTest = indexOfLastTest - TESTS_PER_PAGE;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className='my-tests-page flex-1'>
      <div className='my-tests-content'>
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
          <div className="no-tests-message">
            <div className="no-tests-icon-wrapper">
              <Image
                src="/icons/my-tests.svg"
                alt="No tests"
                width={120}
                height={120}
                className="text-teal-500"
              />
            </div>
            <h2 className="no-tests-title">You haven't added any tests yet</h2>
            <p className="text-base text-gray-600 mb-6">
              Add a new test to start gaining valuable insights into your health.
            </p>
            <Link href='/my-tests/add-test'>
              <Button className="add-test-button" size="lg">
                <Plus className="mr-2 h-4 w-4" /> Add new analysis
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h2 className="tests-history-title">Tests History</h2>
              <div className="table-actions">
                <Button variant="outline" size="sm" className="filter-button">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Link href='/my-tests/add-test'>
                  <Button className="add-test-button" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add new analysis
                  </Button>
                </Link>
              </div>
            </div>
            <div className="tests-table-container no-scrollbar no-scrollbar::-webkit-scrollbar ">
              <Table>
                <TableHeader className='bg-teal-100'>
                  <TableRow >
                    <TableHead>ID</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="hidden sm:table-cell">Info</TableHead>
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
                          <FileText className="h-4 w-4 mr-2 text-teal-500" />
                          {test.testType}
                        </div>
                      </TableCell>
                      <TableCell>{test.date}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {test.additionalInfo.substring(0, 50)}...
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
      </div>
    </section>
  );
}

export default MyTestsPage;