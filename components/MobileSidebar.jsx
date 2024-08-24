import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import UserFooter from './UserFooter';

const MobileSidebar = ({ user, isOpen, onClose }) => {
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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl rounded-3xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src='/icons/logo.png'
              width={34}
              height={34}
              alt='Medcheck logo'
            />
            <h1 className='sidebar-logo'> Medcheck</h1>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
            return (
              <Link
                href={item.route}
                key={item.label}
                className={cn('sidebar-link mb-2', { 'bg-medical-gradient': isActive })}
                onClick={onClose}
              >
                <div className='relative size-6'>
                  <Image
                    src={item.imgUrl}
                    alt={item.label}
                    fill
                    className={cn({ 'active': isActive })}
                  />
                </div>
                <p className={cn('sidebar-label', { '!text-white': isActive })}>
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
        <UserFooter user={user} handleSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default MobileSidebar;