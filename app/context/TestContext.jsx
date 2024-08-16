'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const TestContext = createContext();

export const useTestContext = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('/api/users/tests', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'X-User-ID': user.uid
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch tests');
          }

          const data = await response.json();
          setTests(data.tests.map(test => ({
            ...test,
            ...Object.fromEntries(
              Object.entries(test).map(([key, value]) => [
                key,
                Array.isArray(value) ? value.map(item => ({
                  ...item,
                  test_date: item.test_date ? new Date(item.test_date).toISOString() : null
                })) : value
              ])
            )
          })));
        } catch (error) {
          console.error('Error fetching tests:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTests();
  }, [user]);

  const addTest = (newTest) => {
    setTests(prevTests => [...prevTests, newTest]);
  };

  return (
    <TestContext.Provider value={{ tests, loading, addTest }}>
      {children}
    </TestContext.Provider>
  );
};
