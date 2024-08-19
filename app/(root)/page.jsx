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
import { Plus, MessageCircle } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { tests, loading } = useTestContext();
  const router = useRouter();

  const handleAddTestClick = (e) => {
    e.stopPropagation();
    router.push('/my-tests/add-test');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <section className='home-page'>
      <div className='home-content'>
        <header className='flex flex-col justify-between gap-8'>
          <HeaderBox
            type='greeting'
            title='Welcome back,'
            user={user ? user.displayName || 'User' : 'Guest'}
            subtext='Take control of your health with easy-to-understand medical test insights.'
          />
        </header>

        <div className="mt-8 md:mt-16 flex flex-col lg:flex-row justify-between items-center gap-8">
          <Link href="/assistant" className="tests-card-link w-full lg:w-1/2">
            <section className="tests-card flex flex-col md:flex-row justify-start items-center cursor-pointer border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 bg-white relative">
              <div className="w-full md:w-80 h-40 flex items-center justify-center max-md:mb-4">
                <img src='./images/bot.svg' alt="Bot" className="w-80 h-40" />
              </div>
              <div className="flex flex-col items-start pb-12 md:mb-0 md:ml-4 w-full">
                <h2 className="text-2xl font-semibold text-gray-900">Your Personal AI Assistant</h2>
                <p className="text-sm text-gray-600">Get insights and recommendations</p>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center">
                <MessageCircle className="mr-2 h-4 w-4 text-teal-500" />
                <span className="text-teal-500">Chat Now</span>
              </div>
            </section>
          </Link>
          
          <Link href="/my-tests" className="tests-card-link w-full lg:w-1/2">
            <section className="tests-card flex flex-col md:flex-row justify-start items-center cursor-pointer border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 bg-white">
              {tests.length > 0 && (
                <div className="w-full md:w-40 h-40 p-2 flex items-center justify-center">
                  <DoughnutChart tests={tests} />
                </div>
              )}
              <div className="flex flex-col items-start md:mt-0 md:ml-4 w-full md:w-40 md:h-40 justify-center">
                <h2 className="text-2xl font-semibold text-gray-900">My Tests</h2>
                <p className="text-sm text-gray-600">{tests.length} analyses completed</p>
                <Button 
                  onClick={handleAddTestClick} 
                  className="mt-4 md:mt-2 h-8 bg-teal-500 hover:bg-teal-600 rounded-xl flex items-center justify-center"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Test
                </Button>
              </div>
            </section>
          </Link>

        </div>
        <div className="h-5"></div>
      </div>
    </section>
  );
}

export default Home;
