import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', icon: '🏠', key: 'home' },
  { path: '/prayer', icon: '🕌', key: 'prayer_times' },
  { path: '/quran', icon: '📖', key: 'quran' },
  { path: '/azkar', icon: '📿', key: 'azkar' },
  { path: '/hadith', icon: '📜', key: 'hadith' },
  { path: '/settings', icon: '⚙️', key: 'settings' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { language } = useApp();
  const location = useLocation();

  return (
    <>
      {/* Top Header */}
      <header 
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {/* اللوجو الجديد بدل ☪️ */}
       <img 
  src="/WhatsApp_Image_2026-05-05_at_1.24.08_AM-removebg-preview (1).png" 
  alt="Islamic Logo" 
  className="w-16 h-14 object-contain" 
/>
          
          {/* <span className="font-display text-sm font-bold" style={{ color: 'var(--color-gold)' }}>
            {t('app_name')}
          </span> */}
        </div>

        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            weekday: 'long', 
            day: 'numeric', 
            month: 'long'
          })}
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav 
        style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}
        className="fixed bottom-0 left-0 right-0 z-50 px-2 py-2"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(212, 175, 55, 0.15)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-lg relative z-10">{item.icon}</span>
                <span 
                  className="text-xs font-medium relative z-10 whitespace-nowrap"
                  style={{ 
                    color: isActive ? 'var(--color-gold)' : 'var(--color-text-muted)', 
                    fontSize: '9px' 
                  }}
                >
                  {t(item.key)}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}