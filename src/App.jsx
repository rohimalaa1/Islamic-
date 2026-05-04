import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PrayerPage from './pages/PrayerPage';
import QuranPage from './pages/QuranPage';
import AzkarPage from './pages/AzkarPage';
import HadithPage from './pages/HadithPage';
import SettingsPage from './pages/SettingsPage';
import './i18n';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
          <Navbar />
          <main className="pt-16 pb-24 max-w-lg mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/prayer" element={<PrayerPage />} />
              <Route path="/quran" element={<QuranPage />} />
              <Route path="/azkar" element={<AzkarPage />} />
              <Route path="/hadith" element={<HadithPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
