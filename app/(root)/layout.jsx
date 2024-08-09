// (root)/layout.jsx

'use client'

import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { WithAuth } from '../../components/WithAuth';
import Image from "next/image";

function RootLayout({ children }) {
  return (
    <main className="flex font-inter">
      <Sidebar/>
      <div className=" w-full flex-col ">
        <div className="root-layout">
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
  );
}

export default WithAuth(RootLayout);