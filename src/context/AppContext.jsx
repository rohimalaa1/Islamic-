import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('i18nextLng') || 'ar';
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem('notificationsEnabled') || 'false');
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem('soundEnabled') || 'true');
  });

  const [calculationMethod, setCalculationMethod] = useState(() => {
    return parseInt(localStorage.getItem('calculationMethod') || '4');
  });

  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('calculationMethod', calculationMethod.toString());
  }, [calculationMethod]);

  useEffect(() => {
    if (location) {
      localStorage.setItem('userLocation', JSON.stringify(location));
    }
  }, [location]);

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      language, setLanguage,
      notificationsEnabled, setNotificationsEnabled,
      soundEnabled, setSoundEnabled,
      calculationMethod, setCalculationMethod,
      location, setLocation,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
