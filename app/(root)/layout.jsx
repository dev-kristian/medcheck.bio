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
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="root-layout md:hidden">
          <Image
            src='/icons/logo.png'
            width={30}
            height={30}
            alt='logo'
          />
          <MobileNav />
        </div>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
    </main>
  );
}

export default WithAuth(RootLayout);