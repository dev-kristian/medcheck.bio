// app/layout.jsx
'use client'

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { WithAuth } from '@/components/WithAuth';
import { WithProfileCompletion } from '@/components/WithProfileCompletion';
import { TestProvider } from '@/app/context/TestContext';
import Image from "next/image";
import { useAuth } from '@/hooks/useAuth';
import { ConversationsProvider } from '../context/ConversationsContext';
import { ProfileProvider } from '../context/ProfileContext';

function RootLayout({ children }) {
  const {user}= useAuth();
  return (
        <TestProvider>
          <ConversationsProvider>
            <ProfileProvider>
              <main className="flex h-screen w-full font-inter">
                <Sidebar user={user}/>
                <div className="flex size-full flex-col">
                  <div className="root-layout ">
                    <Image
                      src='/icons/logo.png'
                      width={30}
                      height={30}
                      alt='logo'
                    />
                    <div>
                      <MobileNav user={user}/>
                    </div>
                  </div>
                  {children}
                </div>
              </main>
            </ProfileProvider>
          </ConversationsProvider>
        </TestProvider>
      );
    }

export default WithAuth(WithProfileCompletion(RootLayout));