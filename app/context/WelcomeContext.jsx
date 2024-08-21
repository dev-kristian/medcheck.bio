// contexts/WelcomeContext.js
import React, { createContext, useContext, useState } from 'react';

const WelcomeContext = createContext();

export function WelcomeProvider({ children }) {
  const [welcomeState, setWelcomeState] = useState({
    section: 1,
    displayName: '',
  });

  const updateWelcomeState = (updates) => {
    setWelcomeState(prevState => ({ ...prevState, ...updates }));
  };

  return (
    <WelcomeContext.Provider value={{ welcomeState, updateWelcomeState }}>
      {children}
    </WelcomeContext.Provider>
  );
}

export const useWelcome = () => useContext(WelcomeContext);
