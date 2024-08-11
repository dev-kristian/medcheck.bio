// app/contexts/TestContext.jsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

const TestContext = createContext();

export const useTestContext = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = () => {
      const allTests = Object.keys(localStorage)
        .filter(key => key.startsWith('testResult_'))
        .map(key => {
          const test = JSON.parse(localStorage.getItem(key));
          return { ...test, id: key.replace('testResult_', '') };
        });
      setTests(allTests);
      setLoading(false);
    };

    fetchTests();
  }, []);

  const addTest = (id, newTest) => {
    const storageKey = `testResult_${id}`;
    localStorage.setItem(storageKey, JSON.stringify(newTest));
    setTests(prevTests => [...prevTests, newTest]);
  };

  const updateTest = (id, updatedTest) => {
    localStorage.setItem(`testResult_${id}`, JSON.stringify(updatedTest));
    setTests(prevTests => prevTests.map(test => 
      test.id === id ? { ...updatedTest, id } : test
    ));
  };

  const deleteTest = (id) => {
    localStorage.removeItem(`testResult_${id}`);
    setTests(prevTests => prevTests.filter(test => test.id !== id));
  };

  return (
    <TestContext.Provider value={{ tests, loading, addTest, updateTest, deleteTest }}>
      {children}
    </TestContext.Provider>
  );
};