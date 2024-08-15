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
import { Plus, Bot } from "lucide-react"; // Import Bot icon

const Home = () => {
  const { user } = useAuth();
  const { tests, loading } = useTestContext();
  const router = useRouter();

  const handleAddTestClick = (e) => {
    e.stopPropagation();
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

        <div className="mt-8 md:mt-16 flex flex-col lg:flex-row justify-between items-center gap-8">
          <Link href="/my-tests" className="tests-card-link w-full lg:w-1/2">
            <section className="tests-card flex justify-start items-center cursor-pointer p-4 border rounded-lg shadow-md">
              <div className="w-32 h-32 p-2">
                <DoughnutChart tests={tests}/>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col px-4">
                    <h2 className="text-26 font-semibold text-gray-900">My Tests</h2>
                    {loading ? (
                      <p className="text-14 text-gray-600">Loading...</p>
                    ) : (
                      <p className="text-14 text-gray-600">{tests.length} analyses completed</p>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <Button 
                    onClick={handleAddTestClick} 
                    className="m-2 h-8 bg-teal-500 hover:bg-teal-600 rounded-xl"
                  >
                    <Plus className="mr-2 h-4 w-4 " /> Add New Test
                  </Button>
                </div>
              </div>
            </section>
          </Link>

          <Link href="/ai-assistant" className="tests-card-link w-full lg:w-1/2">
            <section className="tests-card flex justify-start items-center cursor-pointer p-4 border rounded-lg shadow-md">
              <div className="w-32 h-32 p-2 flex items-center justify-center">
                <Bot className="h-16 w-16 text-gray-900" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col px-4">
                    <h2 className="text-26 font-semibold text-gray-900">AI Assistant</h2>
                    <p className="text-14 text-gray-600">Get insights and recommendations</p>
                  </div>
                </div>
              </div>
            </section>
          </Link>
        </div>
      </div>

      <RightSidebar user={user} />
    </section>
  );
}

export default Home;
