// src/components/WithProfileCompletion.js

'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function WithProfileCompletion(Component) {
  return function ProfileCompletionComponent(props) {
    const { user, loading } = useAuth();
    const [profileCompleted, setProfileCompleted] = useState(null);
    const router = useRouter();

    useEffect(() => {
      async function checkProfileCompletion() {
        if (user) {
          try {
            const idToken = await user.getIdToken();
            const response = await fetch(`/api/users?userId=${user.uid}`, {
              headers: {
                'Authorization': `Bearer ${idToken}`
              }
            });
            const data = await response.json();
            
            if (response.ok) {
              setProfileCompleted(data.profileCompleted);
              if (!data.profileCompleted) {
                router.push('/welcome');
              }
            } else {
              console.error('Error checking profile completion:', data.error);
            }
          } catch (error) {
            console.error('Error checking profile completion:', error);
          }
        }
      }

      if (!loading) {
        checkProfileCompletion();
      }
    }, [user, loading, router]);

    if (loading || profileCompleted === null) {
      return <div>Loading...</div>;
    }

    if (!profileCompleted) {
      return null;
    }

    return <Component {...props} />;
  };
}
