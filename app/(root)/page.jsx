// pages/Home.js
'use client'
import React from 'react';
import HeaderBox from "@/components/HeaderBox";
import { useAuth } from "@/hooks/useAuth";
import { useTestContext } from '@/app/context/TestContext';
import { useProfileContext } from '@/app/context/ProfileContext';
import MedicalProfile from '@/components/home/MedicalProfile';
import Assistant from '@/components/home/Assistant';
import MyTests from '@/components/home/MyTests';

const Home = () => {
  const { user } = useAuth();
  const { tests, loading } = useTestContext();
  const { profileData, loading: profileLoading } = useProfileContext();

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className='page'>
      <header className='flex flex-col justify-between gap-8'>
        <HeaderBox
          type='greeting'
          title='Welcome back,'
          user={user ? user.displayName || 'User' : 'Guest'}
          subtext='Take control of your health with easy-to-understand medical test insights.'
        />
      </header>

      <div className="mt-8 md:mt-16 flex flex-col lg:flex-row justify-between items-start gap-4">
        <MedicalProfile profileData={profileData} />

        <div className="flex flex-col gap-4 w-full lg:w-2/5">
          <Assistant />
          <MyTests tests={tests} />
        </div>
      </div>
    </div>
  );
}

export default Home;
