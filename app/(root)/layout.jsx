// app/layout.jsx
'use client'

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { WithAuth } from '@/components/WithAuth';
import { WithProfileCompletion } from '@/components/WithProfileCompletion';
import { TestProvider } from '@/app/context/TestContext';
import Image from "next/image";

function RootLayout({ children }) {
  return (
        <TestProvider>
          <main className="flex h-screen w-full font-inter">
            <Sidebar/>
            <div className="flex size-full flex-col">
              <div className="root-layout ">
                <Image
                  src='/icons/logo.png'
                  width={30}
                  height={30}
                  alt='logo'
                />
                <div>
                  <MobileNav/>
                </div>
              </div>
              {children}
            </div>
          </main>
        </TestProvider>
  );
}

// Wrap the entire layout with WithAuth
export default WithAuth(WithProfileCompletion(RootLayout));