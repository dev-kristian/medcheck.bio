// (root)/layout.jsx

'use client'

import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { WithAuth } from '../../components/WithAuth';
import Image from "next/image";

function RootLayout({ children }) {
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar />
      <div className="flex flex-col w-full">
        <nav className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white h-[var(--navbar-height)] shadow-md">
          <div className="flex items-center justify-between h-full px-4">
            <Image
              src='/icons/logo.png'
              width={30}
              height={30}
              alt='logo'
            />
            <MobileNav />
          </div>
        </nav>
        <div className="flex-1 overflow-y-auto md:overflow-y-visible pt-[var(--navbar-height)] md:pt-0">
          {children}
        </div>
      </div>
    </main>
  );
}

export default WithAuth(RootLayout);