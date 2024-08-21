// (welcome)/layout.jsx
'use client'

import { WithAuth } from "@/components/WithAuth";
import { WelcomeProvider } from "../context/WelcomeContext";

function WelcomeLayout({ children }) {
  return (
    <WelcomeProvider>
      <div className="min-h-screen md:bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl mt-4 md:mt-20 px-2 md:shadow-xl overflow-hidden">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </WelcomeProvider>
  );
}

export default WithAuth(WelcomeLayout);