//components/Sidebar.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        <Link href="/" className='mb-8 cursor-pointer flex items-center gap-2 mr-4'>
            <Image
                src='/icons/logo.png'
                width={34}
                height={34}
                alt='Medcheck logo'
                className='size-[24px] max-xl:size-12 '
            />
            <h1 className='sidebar-logo'> Medcheck</h1>
        </Link>
          {sidebarLinks.map((item)=> {
              const isActive = pathname ===item.route || pathname.startsWith(`${item.route}/`)
              return (
                  <Link 
                      href={item.route}
                      key={item.label}
                      className={cn('sidebar-link', {'bg-medical-gradient':isActive})}
                      >
                      <div className='relative size-6'>
                      <Image
                          src={item.imgUrl}
                          alt={item.label}
                          fill 
                          className={cn({
                              'brightness-[10] invert-0' : isActive
                          })}
                      />
                      </div>
                      <p className={cn('sidebar-label', {'!text-white':isActive})}>
                      {item.label}
                      </p>
                  </Link>
              )
          })}
        </nav>
      <button
        onClick={handleSignOut}
        className="w-full py-2 px-4 flex items-center justify-center text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors duration-200"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sign Out
      </button>
    </section>
  );
};

export default Sidebar;