// MyTests.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Using Next.js Image component
import { useRouter } from 'next/navigation';
import { Plus } from "lucide-react";

const MyTests = ({ tests = [] }) => {
  const router = useRouter();

  const handleAddTestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/my-tests/add-test');
  };

  return (
    <Link 
      href="/my-tests" 
      className="tests-card-link w-full transition-all duration-300 hover:scale-[1.02]  focus:outline-none focus:ring-2 focus:ring-teal-500/20 rounded-xl"
    >
      <section className="home-card flex flex-col md:flex-row relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl">
        {/* Image Container */}
        <div className="w-full md:w-72 lg:w-80 h-32 sm:h-36 md:h-40 flex items-center justify-center max-md:mb-4 transition-transform duration-300 group-hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-500/5 rounded-lg" />
          <Image
            src="/images/empty.svg" 
            alt="My Tests"
            width={320}
            height={160}
            priority
            className="drop-shadow-md hover:drop-shadow-xl transition-all duration-300 w-auto h-auto max-h-full object-contain"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
        {/* Content Container */}
        <div className="flex flex-col items-start pb-16 sm:pb-14 md:mb-0 md:ml-6 lg:ml-8 w-full">
          <div className="flex items-center flex-wrap gap-2 mb-2 sm:mb-3">
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              My Tests
            </h2>
            {tests.length > 0 && (
              <span className="text-xs sm:text-sm bg-teal-100/80 text-teal-700 px-2 sm:px-3 py-0.5 rounded-full font-medium shadow-sm">
                {tests.length}
              </span>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
            {tests.length > 0 
              ? `${tests.length} ${tests.length === 1 ? 'analysis' : 'analyses'} completed`
              : 'Start tracking your health by adding your first test'
            }
          </p>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-100/80 text-gray-600 rounded-full">Track Results</span>
            <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-100/80 text-gray-600 rounded-full">Monitor Progress</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-teal-50 hover:bg-teal-100 transition-all duration-300 shadow-sm hover:shadow group text-sm sm:text-base"
          onClick={handleAddTestClick}
          aria-label="Add test"
        >
          <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          <span className="text-teal-600 font-medium whitespace-nowrap">
            {tests.length > 0 ? 'Add New Test' : 'Add First Test'}
          </span>
        </button>
      </section>
    </Link>
  );
};

export default MyTests;
