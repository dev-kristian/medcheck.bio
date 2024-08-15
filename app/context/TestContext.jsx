// app/contexts/TestContext.jsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
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
        const testsRef = collection(db, 'users', user.uid, 'biomarkers_report');
        const snapshot = await getDocs(testsRef);
        const allTests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTests(allTests);
        setLoading(false);
      }
    };

    fetchTests();
  }, [user]);

  const addTest = async (newTest) => {
    const testsRef = collection(db, 'users', user.uid, 'biomarkers_report');
    const docRef = await addDoc(testsRef, {
      ...newTest,
      createdAt: new Date()
    });
    const testWithId = { ...newTest, id: docRef.id };
    setTests(prevTests => [...prevTests, testWithId]);
    return testWithId;
  };

  return (
    <TestContext.Provider value={{ tests, loading, addTest }}>
      {children}
    </TestContext.Provider>
  );
};
