import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const AppContext = createContext(null);

const todayKey = () => new Date().toISOString().slice(0, 10);

// Get last N days as array of date strings
export const getLastDays = (n) => {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();
};

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

  const [adhanSound, setAdhanSound] = useState(() => {
    return JSON.parse(localStorage.getItem('adhanSound') || 'true');
  });

  const [preAdhanAlert, setPreAdhanAlert] = useState(() => {
    return JSON.parse(localStorage.getItem('preAdhanAlert') || 'true');
  });

  const [calculationMethod, setCalculationMethod] = useState(() => {
    return parseInt(localStorage.getItem('calculationMethod') || '4');
  });

  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Prayers performed tracker (resets daily, saves to history) ──
  const [prayersPerformed, setPrayersPerformed] = useState(() => {
    const saved = localStorage.getItem('prayersPerformed');
    if (!saved) return {};
    const { date, data } = JSON.parse(saved);
    return date === todayKey() ? data : {};
  });

  // ── Prayer history: { 'YYYY-MM-DD': { Fajr: 'done'|'missed', ... } } ──
  const [prayerHistory, setPrayerHistory] = useState(() => {
    const saved = localStorage.getItem('prayerHistory');
    return saved ? JSON.parse(saved) : {};
  });

  // ── Daily Wird ──
  const [dailyWird, setDailyWird] = useState(() => {
    const saved = localStorage.getItem('dailyWird');
    if (!saved) return { quranPages: 2, azkarMorning: true, azkarEvening: true, tasbih: 100 };
    return JSON.parse(saved);
  });

  // ── Wird progress (resets daily) ──
  const [wirdProgress, setWirdProgress] = useState(() => {
    const saved = localStorage.getItem('wirdProgress');
    if (!saved) return {};
    const { date, data } = JSON.parse(saved);
    return date === todayKey() ? data : {};
  });

  // Persist
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.remove('light');
    else root.classList.add('light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', language);
  }, [language]);

  useEffect(() => { localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled)); }, [notificationsEnabled]);
  useEffect(() => { localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled)); }, [soundEnabled]);
  useEffect(() => { localStorage.setItem('adhanSound', JSON.stringify(adhanSound)); }, [adhanSound]);
  useEffect(() => { localStorage.setItem('preAdhanAlert', JSON.stringify(preAdhanAlert)); }, [preAdhanAlert]);
  useEffect(() => { localStorage.setItem('calculationMethod', calculationMethod.toString()); }, [calculationMethod]);
  useEffect(() => { if (location) localStorage.setItem('userLocation', JSON.stringify(location)); }, [location]);

  useEffect(() => {
    localStorage.setItem('prayersPerformed', JSON.stringify({ date: todayKey(), data: prayersPerformed }));
    // Save to history too
    if (Object.keys(prayersPerformed).length > 0) {
      setPrayerHistory(prev => {
        const updated = { ...prev, [todayKey()]: prayersPerformed };
        localStorage.setItem('prayerHistory', JSON.stringify(updated));
        return updated;
      });
    }
  }, [prayersPerformed]);

  useEffect(() => {
    localStorage.setItem('wirdProgress', JSON.stringify({ date: todayKey(), data: wirdProgress }));
  }, [wirdProgress]);

  useEffect(() => {
    localStorage.setItem('dailyWird', JSON.stringify(dailyWird));
  }, [dailyWird]);

  useEffect(() => {
    localStorage.setItem('prayerHistory', JSON.stringify(prayerHistory));
  }, [prayerHistory]);

  const markPrayer = (prayerName, status) => {
    setPrayersPerformed(p => ({ ...p, [prayerName]: status }));
  };

  const updateWirdProgress = (key, value) => {
    setWirdProgress(p => ({ ...p, [key]: value }));
  };

  // ✅ دالة جديدة: تزيد قيمة رقمية على الـ progress (للقرآن والتسبيح)
  const incrementWirdProgress = (key, amount) => {
    setWirdProgress(p => ({ ...p, [key]: (p[key] || 0) + amount }));
  };

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      language, setLanguage,
      notificationsEnabled, setNotificationsEnabled,
      soundEnabled, setSoundEnabled,
      adhanSound, setAdhanSound,
      preAdhanAlert, setPreAdhanAlert,
      calculationMethod, setCalculationMethod,
      location, setLocation,
      prayersPerformed, markPrayer,
      prayerHistory, setPrayerHistory,
      dailyWird, setDailyWird,
      wirdProgress, updateWirdProgress, incrementWirdProgress,
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