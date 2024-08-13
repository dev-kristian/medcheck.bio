// contexts/WelcomeContext.js
import React, { createContext, useContext, useState } from 'react';

const WelcomeContext = createContext();

export function WelcomeProvider({ children }) {
  const [welcomeState, setWelcomeState] = useState({
    step: 1,
    section: 1,
    displayName: '',
    age: '',
    gender: '',
    medicalHistory: '',
    // Add more fields as needed
  });

  const updateWelcomeState = (updates) => {
    setWelcomeState(prevState => ({ ...prevState, ...updates }));
  };

  const saveSection = async (sectionNumber) => {
    try {
      const response = await fetch('/api/users/welcome', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...welcomeState, section: sectionNumber }),
      });
      if (!response.ok) throw new Error('Failed to save section');
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  return (
    <WelcomeContext.Provider value={{ welcomeState, updateWelcomeState, saveSection }}>
      {children}
    </WelcomeContext.Provider>
  );
}

export const useWelcome = () => useContext(WelcomeContext);
