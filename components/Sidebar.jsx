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

const Sidebar = ({ user }) => {
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
    <section className='max-md:hidden flex flex-col h-screen'>
      <div className='flex-grow flex flex-col overflow-y-auto'>
      <div className="flex justify-between items-center p-4">
        <Link href="/" className='flex items-center gap-2'>
          <Image
            src='/icons/logo.png'
            width={34}
            height={34}
            alt='Medcheck logo'
          />
          <h1 className='sidebar-logo'> Medcheck</h1>
        </Link>
        </div>
        <nav className='flex-grow px-2 py-2'>
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
            return (
              <Link
                href={item.route}
                key={item.label}
                className={cn('sidebar-link mb-2', { 'bg-medical-gradient': isActive })}
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
        </nav>
      </div>
      <UserFooter user={user} handleSignOut={handleSignOut} />
    </section>
  );
};

export default Sidebar;