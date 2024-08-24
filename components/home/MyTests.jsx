// components/home/MyTests.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import DoughnutChart from "@/components/DoughnutChart";
import { Plus } from "lucide-react";

const MyTests = ({ tests }) => {
  const router = useRouter();

  const handleAddTestClick = (e) => {
    e.stopPropagation();
    router.push('/my-tests/add-test');
  };

  return (
    <Link href="/my-tests" className="tests-card-link w-full">
      <section className="home-card flex flex-col md:flex-row">
        {tests.length > 0 ? (
          <>
            <div className="w-full md:w-40 h-40 p-2 flex items-center justify-center">
              <DoughnutChart tests={tests} />
            </div>
            <div className="flex flex-col items-start xl:ml-4 w-full">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">My Tests</h2>
              <p className="text-sm text-gray-600 mb-10">{tests.length} analyses completed</p>
              <Button 
                onClick={handleAddTestClick} 
                className="px-2 outline bg-white outline-0 text-teal-500 hover:text-teal-700 hover rounded-xl flex items-center justify-center absolute bottom-2 right-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Test
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col xl:flex-row items-start text-start w-full">
            <div className='w-full xl:w-80 h-40 flex items-center justify-center mb-4 xl:mb-0'>
              <img src="/images/empty.svg" alt="No tests" className="w-80 h-40 mx-auto xl:mx-0" />
            </div>
            <div className='flex flex-col items-start xl:ml-4 w-full'>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Tests Yet</h2>
              <p className="text-sm text-gray-600 mb-10">Start tracking your health by adding your first test</p>
              <Button 
                onClick={handleAddTestClick} 
                variant="ghost"
                className="px-2 outline bg-white outline-0 text-teal-500 hover:text-teal-700 hover rounded-xl flex items-center justify-center absolute bottom-2 right-4"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Your First Test
              </Button>
            </div>
          </div>
        )}
      </section>
    </Link>
  );
};

export default MyTests;
