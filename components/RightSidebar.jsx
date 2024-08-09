// components/RightSidebar.jsx

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const RightSidebar = ({ user }) => {
  // Assume that the user object has a photoURL property when signed in with Google
  const profileImageUrl = user && user.photoURL;

  return (
    <aside className='right-sidebar'>
      <section className='flex flex-col pb-8'>
        <div className='profile-banner' />
        <div className='profile'>
          <div className='profile-img'>
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={`${user.displayName}'s profile`}
                width={80} // Adjust the size as needed
                height={80}
                className='rounded-full' // Makes the image circular
              />
            ) : (
              <span className='text-5xl font-bold text-teal-500'>
                {user && user.displayName ? user.displayName[0] : 'G'}
              </span>
            )}
          </div>
          <div className='profile-details'>
            <h1 className='profile-name'>
              {user && user.displayName ? user.displayName : 'Guest'}
            </h1>
            <p className='profile-email'>
              {user && user.email ? user.email : 'guest@example.com'}
            </p>
          </div>
        </div>
      </section>
      <section className='subscription'>
        <div className='flex w-full justify-between'>
          <h2 className='header-2'> My Subscription</h2>
          <Link href={'/'} className='flex gap-2'>
            <Image
              src="/icons/creditcard.svg"
              width={20}
              height={20}
              alt='creditcard'
            />
            <h2 className='text-14 font-semibold text-gray-600'>
              Customer Portal
            </h2>
          </Link>
        </div>
      </section>
    </aside>
  );
}

export default RightSidebar;
