import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

const PRAYERS = [
  { key: 'Fajr', icon: '🌅', tKey: 'fajr' },
  { key: 'Sunrise', icon: '☀️', tKey: 'sunrise' },
  { key: 'Dhuhr', icon: '🌞', tKey: 'dhuhr' },
  { key: 'Asr', icon: '🌤️', tKey: 'asr' },
  { key: 'Maghrib', icon: '🌇', tKey: 'maghrib' },
  { key: 'Isha', icon: '🌙', tKey: 'isha' },
];

export default function PrayerList({ prayerTimes, nextPrayer }) {
  const { t } = useTranslation();
  const { language } = useApp();

  const isNext = (key) => nextPrayer?.name === key;

  const isPast = (timeStr) => {
    if (!timeStr) return false;
    const [h, m] = timeStr.split(':').map(Number);
    const t = new Date();
    t.setHours(h, m, 0, 0);
    return t < new Date();
  };

  return (
    <div className="space-y-2">
      {PRAYERS.map((prayer, i) => {
        const timeStr = prayerTimes?.[prayer.key];
        const active = isNext(prayer.key);
        const past = isPast(timeStr);

        return (
          <motion.div
            key={prayer.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
            style={{
              background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))' : 'var(--color-surface)',
              border: active ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--color-border)',
              boxShadow: active ? '0 0 20px rgba(212,175,55,0.15)' : 'none',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{prayer.icon}</span>
              <span className="font-medium" style={{
                color: active ? 'var(--color-gold)' : past ? 'var(--color-text-muted)' : 'var(--color-text)'
              }}>
                {t(prayer.tKey)}
              </span>
              {active && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium badge-pulse"
                  style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--color-gold)' }}>
                  {t('next_prayer')}
                </span>
              )}
            </div>
            <span className="font-mono font-semibold" style={{
              color: active ? 'var(--color-gold)' : past ? 'var(--color-text-muted)' : 'var(--color-text)'
            }}>
              {timeStr ? new Date(`1970-01-01T${timeStr}:00`).toLocaleTimeString(
                language === 'ar' ? 'ar-SA' : 'en-US',
                { hour: '2-digit', minute: '2-digit' }
              ) : '--:--'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
