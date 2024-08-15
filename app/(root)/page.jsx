// app/page.jsx
'use client'

import HeaderBox from "@/components/HeaderBox";
import { useAuth } from "@/hooks/useAuth";
import { useTestContext } from '@/app/context/TestContext';
import RightSidebar from "@/components/RightSidebar";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import DoughnutChart from "@/components/DoughnutChart";
import { Plus } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { tests, loading } = useTestContext();
  const router = useRouter();

  const handleAddTestClick = () => {
    router.push('/my-tests/add-test');
  };

  return (
    <section className='home-page'>
      <div className='home-content'>
        <header className='flex flex-col justify-between gap-8'>
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={user ? user.displayName || 'User' : 'Guest'}
            subtext='Understand your medical tests easily.' 
          />
        </header>

        <section className="tests-card mt-8 md:mt-16 flex justify-start items-center">
          <div className="w-32 h-32 p-2">
            <DoughnutChart tests={tests}/>
          </div>
          <div>
            <Link href="/my-tests" className="flex items-center justify-between">
              <div className="flex flex-col px-4">
                <h2 className="text-26 font-semibold text-gray-900">My Tests</h2>
                {loading ? (
                  <p className="text-14 text-gray-600">Loading...</p>
                ) : (
                  <p className="text-14 text-gray-600">{tests.length} analyses completed</p>
                )}
              </div>
            </Link>
            <div className="flex">
              <Button 
                onClick={handleAddTestClick} 
                className="m-2 h-8 bg-teal-500 hover:bg-teal-600 rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Test
              </Button>
            </div>
          </div>
        </section>
      </div>

      <RightSidebar user={user} />
    </section>
  );
}

export default Home;
