'use client'
import React from 'react';
import HeaderBox from "@/components/HeaderBox";
import { useAuth } from "@/hooks/useAuth";
import { useTestContext } from '@/app/context/TestContext';
import { useProfileContext } from '@/app/context/ProfileContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import DoughnutChart from "@/components/DoughnutChart";
import { Plus, MessageCircle, Calendar, User, Weight, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Activity } from "lucide-react";

const getStatusColor = (likelihood) => {
  switch (likelihood.toLowerCase()) {
    case "high": return "text-red-500";
    case "medium": return "text-yellow-500";
    case "low": return "text-green-600";
    default: return "text-gray-500";
  }
};

const getStatusIcon = (likelihood) => {
  switch (likelihood.toLowerCase()) {
    case "high": return <ChevronsUp className="w-4 h-4" />;
    case "medium": return <ChevronUp className="w-4 h-4" />;
    case "low": return <ChevronDown className="w-4 h-4" />;
    default: return <Activity className='w-4 h-4'/>;
  }
};

const getBorderColor = (likelihood) => {
  switch (likelihood.toLowerCase()) {
    case "high": return "border-red-500";
    case "medium": return "border-yellow-500";
    case "low": return "border-green-600";
    default: return "border-gray-500";
  }
};

const ConditionDisplay = ({ condition }) => {
  return (
    <div className={`bg-white px-2 py-1 rounded-lg shadow-lg mb-3 grid grid-cols-[1fr,auto] gap-2 items-center border-l-4 ${getBorderColor(condition.likelihood)}`}>
      <div className="overflow-hidden">
        <div className="font-medium text-lg truncate">{condition.condition}</div>
        <div className="text-xs text-gray-400 truncate">
          {condition.description}
        </div>
      </div>
      <div className="flex items-center">
        <span className={`${getStatusColor(condition.likelihood)} mr-1 flex`}>
          {getStatusIcon(condition.likelihood)}
        </span>
        <div className={`font-bold ${getStatusColor(condition.likelihood)}`}>
          {condition.likelihood}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const { tests, loading } = useTestContext();
  const { profileData, loading: profileLoading } = useProfileContext();
  const router = useRouter();

  const handleAddTestClick = (e) => {
    e.stopPropagation();
    router.push('/my-tests/add-test');
  };

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const { age, gender, bmi } = profileData?.profile || {};
  const potentialConditions = profileData?.potentialConditions?.conditions || [];

  return (
      <div className='home-content '>
        <header className='flex flex-col justify-between gap-8'>
          <HeaderBox
            type='greeting'
            title='Welcome back,'
            user={user ? user.displayName || 'User' : 'Guest'}
            subtext='Take control of your health with easy-to-understand medical test insights.'
          />
        </header>

        <div className="mt-8 md:mt-16 flex flex-col lg:flex-row justify-between items-start gap-8">
          <Link href="/medical-profile" className="tests-card-link w-full lg:w-3/5 h-full lg:h-auto">
            <section className="tests-card flex flex-col justify-between cursor-pointer border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 bg-white h-full">
              <div className="flex flex-col items-start w-full">
                <h2 className="text-2xl font-semibold text-gray-900">My Medical Profile</h2>
                <p className="text-sm text-gray-600">View your medical data</p>
              </div>
              {profileData && (
                <div className="mt-4 w-full">
                  <div className="flex flex-wrap justify-start text-sm text-gray-600 mb-4">
                    <div className="flex items-center mr-4 mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                      <span>Age: {age?.years_old}</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                      <User className="w-4 h-4 mr-2 text-teal-500" />
                      <span>Gender: {gender}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Weight className="w-4 h-4 mr-2 text-teal-500" />
                      <span>BMI: {bmi?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-2">Potential Conditions:</h3>
                    <div>
                      {potentialConditions.slice(0, 3).map((condition, index) => (
                        <ConditionDisplay key={index} condition={condition} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </Link>

          <div className="flex flex-col gap-8 w-full lg:w-2/5">
            <Link href="/assistant" className="tests-card-link w-full">
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
            
            <Link href="/my-tests" className="tests-card-link w-full">
              <section className="tests-card flex flex-col xl:flex-row justify-start items-center cursor-pointer border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 bg-white">
                {tests.length > 0 && (
                  <div className="w-full md:w-40 h-40 p-2 flex items-center justify-center">
                    <DoughnutChart tests={tests} />
                  </div>
                )}
                <div className="flex flex-col items-start md:mt-0 md:ml-4 w-full  justify-center">
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
        </div>
      </div>
  );
}

export default Home;
