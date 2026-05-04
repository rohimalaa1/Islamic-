import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PrayerCountdown from '../components/PrayerCountdown';
import PrayerList from '../components/PrayerList';
import NotificationToggle from '../components/NotificationToggle';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useNotifications } from '../hooks/useNotifications';
import { getDailyHadith } from '../data/hadith';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { prayerTimes, loading, nextPrayer, countdown, refetch } = usePrayerTimes();
  const { scheduleNotifications } = useNotifications();
  const hadith = getDailyHadith();

  useEffect(() => {
    if (prayerTimes) scheduleNotifications(prayerTimes);
  }, [prayerTimes, scheduleNotifications]);

  const quickLinks = [
    { to: '/quran', icon: '📖', label: t('quran'), color: 'rgba(45,106,79,0.2)' },
    { to: '/azkar', icon: '📿', label: t('azkar'), color: 'rgba(212,175,55,0.15)' },
    { to: '/hadith', icon: '📜', label: t('hadith'), color: 'rgba(139,105,20,0.2)' },
    { to: '/settings', icon: '⚙️', label: t('settings'), color: 'rgba(100,100,150,0.2)' },
  ];

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Notification toggle */}
      <NotificationToggle />

      {/* Prayer countdown */}
      {loading ? (
        <div className="rounded-2xl p-8 flex items-center justify-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex flex-col items-center gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="w-8 h-8 rounded-full border-2 border-t-transparent"
              style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
            <span style={{ color: 'var(--color-text-muted)' }}>{t('loading')}</span>
          </div>
        </div>
      ) : (
        <PrayerCountdown nextPrayer={nextPrayer} countdown={countdown} />
      )}

      {/* Prayer list */}
      {prayerTimes && (
        <div>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
            🕌 {t('prayer_times')}
          </h2>
          <PrayerList prayerTimes={prayerTimes} nextPrayer={nextPrayer} />
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
          🌟 الخدمات
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}>
              <Link to={link.to} className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all hover:scale-105"
                style={{ background: link.color, border: '1px solid var(--color-border)' }}>
                <span className="text-3xl">{link.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Hadith preview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span>📜</span>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-gold)' }}>{t('daily_hadith')}</h3>
        </div>
        <p className="arabic-text text-sm leading-loose mb-2" style={{ color: 'var(--color-text)' }}>
          {hadith.arabic}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          — {hadith.narrator} | {hadith.source}
        </p>
      </motion.div>
    </div>
  );
}
