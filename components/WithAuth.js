'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader'; // Import the Loader component

export function WithAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/sign-in');
        } else if (!user.emailVerified && router.pathname !== '/email-verification') {
          router.push('/verify-email');
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return <Loader />; // Use the Loader component
    }

    if (!user || !user.emailVerified) {
      return null;
    }

    return <Component {...props} />;
  };
}
