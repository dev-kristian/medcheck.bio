import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarLinks } from '@/constants';
import UserFooter from './UserFooter';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

const MobileNav = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <section className='w-full max-w-[264px]'>
      <button onClick={toggleMenu} className='cursor-pointer focus:ring-white'>
        <Image
          src="/icons/hamburger.svg"
          height={30}
          width={30}
          alt='menu'
        />
      </button>
      {isOpen && (
        <div ref={menuRef} className='fixed inset-0 z-50 bg-white px-0' style={{ width: '80%' }}>
          <button onClick={toggleMenu} className='sr-only'>Close Menu</button>
          <Link href="/" className='cursor-pointer flex items-center gap-2 px-2'>
            <Image
              src='/icons/logo.png'
              width={34}
              height={34}
              alt='Medcheck logo'
            />
            <h1 className='text-26 font-ibm-plex-serif-font-bold text-teal-500'> Medcheck</h1>
          </Link>
          <div className='mobilenav-sheet flex flex-col justify-between px-2'>
            <nav className='flex flex-col gap-4 pt-8 text-white'>
              {sidebarLinks.map((item) => {
                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                return (
                  <Link
                    href={item.route}
                    key={item.label}
                    className={cn('mobilenav-sheet_close w-full', { 'bg-medical-gradient': isActive })}
                    onClick={toggleMenu}
                  >
                    <Image
                      src={item.imgUrl}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={cn({
                        'brightness-[10] invert-0': isActive
                      })}
                    />
                    <p className={cn('text-16 font-semibold text-black-2', { '!text-white': isActive })}>
                      {item.label}
                    </p>
                  </Link>
                );
              })}
            </nav>
          </div>
          <UserFooter user={user} handleSignOut={handleSignOut} />
        </div>
      )}
    </section>
  );
};

export default MobileNav;
