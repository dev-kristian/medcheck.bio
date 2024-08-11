//components/WithAuth.js

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

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
      return <div>Loading...</div>;
    }

    if (!user || !user.emailVerified) {
      return null;
    }

    return <Component {...props} />;
  };
}
