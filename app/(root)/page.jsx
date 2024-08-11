// app/page.jsx
'use client'

import HeaderBox from "@/components/HeaderBox";
import { useAuth } from "@/hooks/useAuth";
import { useTestContext } from '@/app/context/TestContext';
import RightSidebar from "@/components/RightSidebar";
import Link from 'next/link';
import Image from 'next/image';

const Home = () => {
  const { user } = useAuth();
  const { tests, loading } = useTestContext();
  
  return (
    <section className='page'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={user ? user.displayName || 'User' : 'Guest'}
            subtext='Understand your medical tests easily.' 
          />
        </header>

        <section className="tests-card mt-16 ">
          <Link href="/my-tests" className="flex items-center justify-between">
            <div className="flex flex-col px-4">
              <h2 className="tests-title">My Tests</h2>
              {loading ? (
                <p className="tests-count">Loading...</p>
              ) : (
                <p className="tests-count">{tests.length} analyses completed</p>
              )}
            </div>
            <div className="rounded-full p-2">
              <Image
                src="/icons/my-tests.svg"
                alt="My Tests"
                width={48}
                height={48}
                className="mx-2"
              />
            </div>
          </Link>
        </section>
      </div>

      <RightSidebar 
        user={user} 
      />
    </section>
  );
}

export default Home;