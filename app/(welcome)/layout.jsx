// (welcome)/layout.jsx
'use client'

import { WithAuth } from "@/components/WithAuth";
import { Stepper } from "@/components/Stepper";
import { WithProfileUncompleted } from "@/components/WithProfileUncompleted";

function WelcomeLayout({ children }) {
  return (
    <div className="min-h-screen md:bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl mt-4 md:mt-20 overflow-hidden">
        <Stepper />
        <div className="px-2 md:shadow-xl">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithAuth(WithProfileUncompleted(WelcomeLayout));