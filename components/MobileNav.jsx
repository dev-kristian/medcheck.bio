import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription, 
} from "@/components/ui/sheet";
import { sidebarLinks } from '@/constants';

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            height={30}
            width={30}
            alt='menu'
            className='cursor-pointer'
          />
        </SheetTrigger>
        <SheetContent side='left' className='border-none bg-white'>
          <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
          <SheetDescription className='sr-only'>
            Use the links below to navigate through the different sections of the website.
          </SheetDescription>
          <Link href="/" className='cursor-pointer flex items-center gap-1 px-4'>
            <Image
              src='/icons/logo.png'
              width={34}
              height={34}
              alt='Medcheck logo'
            />
            <h1 className='text-26 font-ibm-plex-serif-font-bold text-teal-500'> Medcheck</h1>
          </Link>
          <div className='mobilenav-sheet'>
            <SheetClose asChild>
              <nav className='flex h-full flex-col gap-6 pt-16 text-white'>
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn('mobilenav-sheet_close w-full', { 'bg-medical-gradient': isActive })}
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
                    </SheetClose>
                  )
                })}
                USER
              </nav>
            </SheetClose>
            FOOTER
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav;
