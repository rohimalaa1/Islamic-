import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { formatTime } from '../hooks/usePrayerTimes';

/* ─── prayer metadata ─────────────────────────────────────── */
const PRAYER_META = {
  Fajr:    { icon: '🌄', nameAr: 'الفجر',  nameEn: 'Fajr'    },
  Sunrise: { icon: '☀️',  nameAr: 'الشروق', nameEn: 'Sunrise', noTrack: true },
  Dhuhr:   { icon: '🌞', nameAr: 'الظهر',  nameEn: 'Dhuhr'   },
  Asr:     { icon: '🌤️', nameAr: 'العصر',  nameEn: 'Asr'     },
  Maghrib: { icon: '🌆', nameAr: 'المغرب', nameEn: 'Maghrib' },
  Isha:    { icon: '🌙', nameAr: 'العشاء', nameEn: 'Isha'    },
};

/* ─── helper: هل وقت الصلاة عدى؟ ────────────────────────── */
const isPastTime = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  const now = new Date();
  const pTime = new Date();
  pTime.setHours(h, m, 0, 0);
  return pTime < now;
};

/* ─── single row ──────────────────────────────────────────── */
function PrayerRow({ name, time, isNext, isPast, isAr, status, onPrayed, onMissed }) {
  const meta = PRAYER_META[name] || {};
  const primaryName   = isAr ? meta.nameAr : meta.nameEn;
  const secondaryName = isAr ? meta.nameEn : meta.nameAr;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: isNext ? 'rgba(212,175,55,0.08)' : 'var(--color-surface)',
        border: `1px solid ${isNext ? 'rgba(212,175,55,0.3)' : 'var(--color-border)'}`,
      }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-bold text-sm"
                style={{ color: isNext ? 'var(--color-gold)' : 'var(--color-text)' }}
              >
                {primaryName}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {secondaryName}
              </span>
            </div>
            {isNext && (
              <span
                className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{
                  background: 'rgba(212,175,55,0.15)',
                  color: 'var(--color-gold)',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
              >
                {isAr ? 'الصلاة القادمة' : 'Next Prayer'}
              </span>
            )}
          </div>
        </div>

        <span
          className="font-bold text-sm tabular-nums"
          style={{ color: isNext ? 'var(--color-gold)' : 'var(--color-text)' }}
        >
          {time}
        </span>
      </div>

      {/* track buttons — تظهر بس بعد ما وقت الصلاة يعدي */}
      {!meta.noTrack && isPast && (
        <div
          className="grid grid-cols-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onPrayed}
            style={{
              padding: '10px 0',
              fontSize: 13, fontWeight: 600,
              border: 'none',
              borderRight: '1px solid var(--color-border)',
              background: status === 'prayed'
                ? 'rgba(45,106,79,0.25)'
                : 'rgba(45,106,79,0.06)',
              color: status === 'prayed' ? '#4ade80' : 'var(--color-text-muted)',
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            ✓ {isAr ? 'صليت' : 'Prayed'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onMissed}
            style={{
              padding: '10px 0',
              fontSize: 13, fontWeight: 600,
              border: 'none',
              background: status === 'missed'
                ? 'rgba(220,38,38,0.15)'
                : 'rgba(220,38,38,0.04)',
              color: status === 'missed' ? '#f87171' : 'var(--color-text-muted)',
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            ✕ {isAr ? 'فائتني' : 'Missed'}
          </motion.button>
        </div>
      )}
    </div>
  );
}

/* ─── exported list ───────────────────────────────────────── */
export default function PrayerList({ prayerTimes, nextPrayer }) {
  const { prayersPerformed, markPrayer } = useApp();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  if (!prayerTimes) return null;

  return (
    <div className="space-y-2">
      {Object.entries(prayerTimes)
        .filter(([name]) => PRAYER_META[name])
        .map(([name, time], i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <PrayerRow
              name={name}
              time={formatTime(time, i18n.language)}
              isNext={nextPrayer?.name === name}
              isPast={isPastTime(time)}
              isAr={isAr}
              status={prayersPerformed[name]}
              onPrayed={() => markPrayer(name, 'prayed')}
              onMissed={() => markPrayer(name, 'missed')}
            />
          </motion.div>
        ))}
    </div>
  );
}