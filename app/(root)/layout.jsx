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

function RootLayout({ children }) {
  const {user}= useAuth();
  return (
        <TestProvider>
          <ConversationsProvider>
          <main className="flex h-screen w-full font-inter">
            <Sidebar user={user}/>
              {children}
          </main>
          </ConversationsProvider>
        </TestProvider>
  );
}

// Wrap the entire layout with WithAuth
export default WithAuth(WithProfileCompletion(RootLayout));