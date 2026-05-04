import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

const PRAYER_ICONS = {
  Fajr: '🌅',
  Sunrise: '☀️',
  Dhuhr: '🌞',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌙',
};

const PRAYER_AR = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export default function PrayerCountdown({ nextPrayer, countdown }) {
  const { t, i18n } = useTranslation();
  const { language } = useApp();

  if (!nextPrayer) return null;

  const prayerName = language === 'ar'
    ? PRAYER_AR[nextPrayer.name]
    : nextPrayer.name;

  const pad = (n) => String(n).padStart(2, '0');

  // Ring animation
  const circumference = 2 * Math.PI * 54;
  const totalSeconds = countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds;
  const maxSeconds = 6 * 3600; // assume max 6 hours
  const progress = Math.max(0, Math.min(1, 1 - totalSeconds / maxSeconds));
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 0 40px rgba(212, 175, 55, 0.1)',
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pattern-overlay" />

      {/* Bismillah decoration */}
      <div className="text-xs mb-3 arabic-text" style={{ color: 'var(--color-gold)', opacity: 0.7, fontSize: '0.9rem' }}>
        ﷽
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
        {t('next_prayer')}
      </p>

      {/* Circular timer */}
      <div className="relative inline-flex items-center justify-center mb-4">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background ring */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="6" />
          {/* Progress ring */}
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl">{PRAYER_ICONS[nextPrayer.name]}</span>
        </div>
      </div>

      {/* Prayer name */}
      <h2 className="text-2xl font-bold mb-1 arabic-text" style={{ color: 'var(--color-gold)' }}>
        {prayerName}
      </h2>
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
        {nextPrayer.time?.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
          hour: '2-digit', minute: '2-digit'
        })}
      </p>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-3">
        {[
          { value: pad(countdown.hours), label: t('hours') },
          { value: pad(countdown.minutes), label: t('minutes') },
          { value: pad(countdown.seconds), label: t('seconds') },
        ].map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--color-gold)' }} className="text-xl font-bold">:</span>}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                <motion.span key={item.value} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  {item.value}
                </motion.span>
              </div>
              <span className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}
