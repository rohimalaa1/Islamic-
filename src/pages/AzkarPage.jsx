import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AzkarCard from '../components/AzkarCard';
import { morningAzkar, eveningAzkar, afterPrayerAzkar } from '../data/azkar';

const TABS = [
  { key: 'morning', tKey: 'morning_azkar', icon: '🌅', data: morningAzkar },
  { key: 'evening', tKey: 'evening_azkar', icon: '🌙', data: eveningAzkar },
  { key: 'after', tKey: 'after_prayer', icon: '🕌', data: afterPrayerAzkar },
];

export default function AzkarPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const currentData = TABS[activeTab].data;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
    <div className="pattern-overlay" style={{ zIndex: 0 }} />
    
    <div className="px-4 py-4 space-y-5" style={{ position: 'relative', zIndex: 1 }}></div>
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
        📿 {t('azkar')}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--color-surface)' }}>
        {TABS.map((tab, i) => (
          <button key={tab.key} onClick={() => setActiveTab(i)}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all relative">
            {activeTab === i && (
              <motion.div layoutId="azkar-tab"
                className="absolute inset-0 rounded-lg"
                style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.3)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-lg">{tab.icon}</span>
            <span className="relative z-10" style={{ color: activeTab === i ? 'var(--color-gold)' : 'var(--color-text-muted)' }}>
              {t(tab.tKey)}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} className="space-y-3">
          {currentData.map((zikr, i) => (
            <AzkarCard key={`${activeTab}-${zikr.id}`} zikr={zikr} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
    </div>
    
  );
}
