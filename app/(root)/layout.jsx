// (root)/layout.jsx

'use client'

import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { WithAuth } from '../../components/WithAuth';
import Image from "next/image";

function RootLayout({ children }) {
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar/>
      <div className="flex size-full flex-col ">

        {children}
      </div>
    </main>
  );
}

export default WithAuth(RootLayout);