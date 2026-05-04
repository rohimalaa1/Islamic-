import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PrayerCountdown from '../components/PrayerCountdown';
import PrayerList from '../components/PrayerList';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useApp } from '../context/AppContext';

export default function PrayerPage() {
  const { t } = useTranslation();
  const { prayerTimes, loading, error, nextPrayer, countdown, refetch } = usePrayerTimes();
  const { location } = useApp();

  return (
    <div className="px-4 py-4 space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          🕌 {t('prayer_times')}
        </h1>
        {location && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            📍 {location.lat?.toFixed(3)}, {location.lng?.toFixed(3)}
          </p>
        )}
      </motion.div>

      {error && (
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ color: '#f87171' }}>{t('error')}</p>
          <button onClick={refetch} className="mt-2 px-4 py-1.5 rounded-lg text-sm"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
            {t('refresh')}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2"
            style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <>
          <PrayerCountdown nextPrayer={nextPrayer} countdown={countdown} />
          {prayerTimes && <PrayerList prayerTimes={prayerTimes} nextPrayer={nextPrayer} />}
        </>
      )}
    </div>
  );
}
