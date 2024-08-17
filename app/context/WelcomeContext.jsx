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
  });

  const updateWelcomeState = (updates) => {
    setWelcomeState(prevState => ({ ...prevState, ...updates }));
  };

  const saveSection = async (sectionNumber) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/users/welcome', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
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
