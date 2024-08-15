import React from 'react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';

const UserFooter = ({ user, handleSignOut }) => {
  return (
    <footer>
      <div className="flex items-center pt-2 border-t border-gray-300 px-2 md:px-4">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          {user && user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={`${user.displayName}'s profile`}
              width={40}
              height={40}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold">
              {user && user.displayName ? user.displayName[0].toUpperCase() : 'G'}
            </div>
          )}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-900">{user ? user.displayName : 'Guest'}</p>
          <p className="text-xs text-gray-500">{user ? user.email : 'guest@example.com'}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="ml-2 p-2 text-sm text-red-500 hover:bg-red-100 rounded-full transition-colors duration-200"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};

export default UserFooter;