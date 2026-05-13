import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PrayerCountdown from '../components/PrayerCountdown';
import PrayerList from '../components/PrayerList';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useApp } from '../context/AppContext';

export default function PrayerPage() {
  const { t } = useTranslation();
  const { prayerTimes, loading, error, nextPrayer, countdown, refetch } = usePrayerTimes();
  const { location, prayersPerformed } = useApp();

  const prayedCount = Object.values(prayersPerformed).filter(v => v === 'prayed').length;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="pattern-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="px-4 py-4 space-y-4" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
              🕌 {t('prayer_times')}
            </h1>
            {location && (
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                📍 {location.city || `${location.lat?.toFixed(3)}, ${location.lng?.toFixed(3)}`}
              </p>
            )}
          </div>
          <div className="text-sm font-bold px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--color-gold)' }}>
            {prayedCount} / 5
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p style={{ color: '#f87171', marginBottom: 8 }}>{t('error')}</p>
              <button onClick={refetch} className="px-4 py-1.5 rounded-lg text-sm"
                style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                {t('refresh')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading / Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            <PrayerCountdown nextPrayer={nextPrayer} countdown={countdown} />
            {prayerTimes && (
              <div>
                <h2 className="text-sm font-semibold px-1 mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  🕌 {t('prayer_times')}
                </h2>
                <PrayerList prayerTimes={prayerTimes} nextPrayer={nextPrayer} />
              </div>
            )}
          </>
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}