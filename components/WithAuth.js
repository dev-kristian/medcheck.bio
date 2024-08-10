// src/components/WithAuth.js

'use client'

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function WithAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      router.push('/sign-in');
      return null;
    }

    return <Component {...props} />;
  };
}