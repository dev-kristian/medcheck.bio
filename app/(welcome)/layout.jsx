// (welcome)/layout.jsx
'use client'

import { WithAuth } from "@/components/WithAuth";
import { WelcomeProvider } from "../context/WelcomeContext";

function WelcomeLayout({ children }) {
  return (
    <WelcomeProvider>
    <div className={` min-h-screen bg-gray-100 flex items-center justify-center`}>
      <div className="max-w-6xl w-full bg-white rounded-3xl m-2 shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
    </WelcomeProvider>
  );
}

export default WithAuth(WelcomeLayout);