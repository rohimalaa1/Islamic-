import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PrayerPage from './pages/PrayerPage';
import QuranPage from './pages/QuranPage';
import AzkarPage from './pages/AzkarPage';
import HadithPage from './pages/HadithPage';
import DuasPage from './pages/DuasPage';
import GhazawatPage from './pages/GhazawatPage';
import SahabaPage from './pages/SahabaPage';
import SunnanPage from './pages/SunnanPage';
import LessonsPage from './pages/LessonsPage';
import SettingsPage from './pages/SettingsPage';
import TashahhudQiblaPage from './pages/TashahhudQiblaPage';
import TasbihPage from './pages/TasbihPage';
import PrayerTrackerPage from "./pages/PrayerTrackerPage";
import StatsPage from './pages/StatsPage';
import AdhanBadge from './components/AdhanBadge';
import { useNotifications } from './hooks/useNotifications';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import useInstallPWA from './useInstallPWA';

import './i18n';

function InstallButton() {
  const { isInstallable, installApp } = useInstallPWA();
  if (!isInstallable) return null;
  return (
    <button
      onClick={installApp}
      style={{
        position: 'fixed', bottom: '20px', left: '20px',
        padding: '10px 14px', background: '#1a472a', color: '#fff',
        border: 'none', borderRadius: '12px', fontSize: '14px',
        zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer',
      }}
    >
      📲 تثبيت التطبيق
    </button>
  );
}

/* ── AdhanController — يشتغل مرة واحدة لكل التطبيق ── */
function AdhanController() {
  const { prayerTimes } = usePrayerTimes();
  const {
    scheduleNotifications,
    activeAdhan, adhanMuted,
    toggleAdhanMute, dismissAdhan,
  } = useNotifications();

  React.useEffect(() => {
    if (prayerTimes) scheduleNotifications(prayerTimes);
  }, [prayerTimes, scheduleNotifications]);

  return (
    <AdhanBadge
      adhan={activeAdhan}
      muted={adhanMuted}
      onMute={toggleAdhanMute}
      onDismiss={dismissAdhan}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
          <Navbar />

          <main className="pt-16 pb-24 max-w-lg mx-auto">
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/prayer"         element={<PrayerPage />} />
              <Route path="/quran"          element={<QuranPage />} />
              <Route path="/azkar"          element={<AzkarPage />} />
              <Route path="/hadith"         element={<HadithPage />} />
              <Route path="/duas"           element={<DuasPage />} />
              <Route path="/ghazawat"       element={<GhazawatPage />} />
              <Route path="/sahaba"         element={<SahabaPage />} />
              <Route path="/sunnan"         element={<SunnanPage />} />
              <Route path="/lessons"        element={<LessonsPage />} />
              <Route path="/tashahhud"      element={<TashahhudQiblaPage />} />
              <Route path="/tasbih"         element={<TasbihPage />} />
              <Route path="/prayer-tracker" element={<PrayerTrackerPage />} />
              <Route path="/stats"          element={<StatsPage />} />
              <Route path="/settings"       element={<SettingsPage />} />
            </Routes>
          </main>

      
          <AdhanController />
          <InstallButton />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}