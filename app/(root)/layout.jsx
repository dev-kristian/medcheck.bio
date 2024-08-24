'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/MobileSidebar';
import { WithAuth } from '@/components/WithAuth';
import { WithProfileCompletion } from '@/components/WithProfileCompletion';
import { TestProvider } from '@/app/context/TestContext';
import { useAuth } from '@/hooks/useAuth';
import { ConversationsProvider } from '../context/ConversationsContext';
import { ProfileProvider } from '../context/ProfileContext';
import { Menu } from 'lucide-react';

function RootLayout({ children }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <TestProvider>
      <ConversationsProvider>
        <ProfileProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <Sidebar user={user} />
            </div>

            {/* Mobile Sidebar */}
            <div ref={sidebarRef}>
              <MobileSidebar 
                user={user} 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
              />
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${isMobileMenuOpen ? 'blur-sm' : ''}`}>
              {/* Sticky Header for Mobile */}
              <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <Image
                      src="/icons/logo.png"
                      width={24}
                      height={24}
                      alt="Medcheck logo"
                      className="mr-2"
                    />
                    <span className="text-2xl font-bold text-teal-500">Medcheck</span>
                  </div>
                  <button 
                    className="text-gray-600"
                    onClick={toggleMobileMenu}
                  >
                    <Menu size={24} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </ProfileProvider>
      </ConversationsProvider>
    </TestProvider>
  );
}

export default WithAuth(WithProfileCompletion(RootLayout));