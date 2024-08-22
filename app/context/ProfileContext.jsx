'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'X-User-ID': user.uid
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }

          const data = await response.json();
          setProfileData(data.profileData);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profileData, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};
