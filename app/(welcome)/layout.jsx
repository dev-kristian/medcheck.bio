// (welcome)/layout.js

'use client'

import { WithAuth } from "@/components/WithAuth";

function WelcomeLayout({ children }) {
  return (
    <main className="flex h-screen w-full font-inter">
      <div className="flex size-full flex-col">
        {children}
      </div>
    </main>
  );
}

export default WithAuth(WelcomeLayout);
