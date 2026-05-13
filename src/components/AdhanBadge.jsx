import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRAYER_ICONS = {
  Fajr: '🌅', Dhuhr: '🌞', Asr: '🌤️', Maghrib: '🌇', Isha: '🌙',
};

/**
 * AdhanBadge
 * Props:
 *   adhan     → { prayer: 'Fajr', nameAr: 'الفجر', time: '04:32' } | null
 *   muted     → boolean
 *   onMute    → () => void
 *   onDismiss → () => void
 */
export default function AdhanBadge({ adhan, muted, onMute, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (adhan) {
      setVisible(true);
      setLocked(false); // reset lock على كل أذان جديد

      // auto-dismiss بعد 60 ثانية لو مش locked
      const t = setTimeout(() => {
        if (!locked) handleDismiss();
      }, 60_000);
      return () => clearTimeout(t);
    }
  }, [adhan]);

  // لو الصفحة اتقفلت، امنع الـ auto-dismiss
  useEffect(() => {
    if (locked) {
      // لو حد فتح الصفحة تاني (visibility change)، افتح الـ badge
      const handleVisibility = () => {
        if (document.visibilityState === 'visible' && locked) {
          setVisible(true);
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }
  }, [locked]);

  const handleDismiss = () => {
    setVisible(false);
    setLocked(false);
    setTimeout(onDismiss, 400);
  };

  const handleLock = () => {
    if (!locked) {
      setLocked(true);
      // قفل الشاشة عبر Wake Lock API لو المتصفح بيدعمها
      if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').catch(() => {});
      }
    } else {
      setLocked(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && adhan && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 60,  scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: 'calc(100% - 32px)',
              maxWidth: 400,
              background: 'linear-gradient(145deg, #0d2318 0%, #122b1e 100%)',
              border: '1px solid rgba(212,175,55,0.45)',
              borderRadius: 24,
              padding: '20px 20px 16px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.1) inset',
              direction: 'rtl',
            }}
          >
            {/* Glow ring */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: -1, left: -1, right: -1, bottom: -1,
                borderRadius: 24,
                border: '1px solid rgba(212,175,55,0.3)',
                pointerEvents: 'none',
              }}
            />

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: 'rgba(212,175,55,0.6)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                حان وقت الصلاة
              </span>
              <button
                onClick={handleDismiss}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: 'none', borderRadius: 8,
                  color: 'rgba(255,255,255,0.45)',
                  width: 28, height: 28,
                  fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Prayer info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: 'rgba(212,175,55,0.12)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, flexShrink: 0,
                }}
              >
                {PRAYER_ICONS[adhan.prayer] || '🕌'}
              </motion.div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 26, fontWeight: 700, color: '#D4AF37',
                  fontFamily: 'serif', lineHeight: 1.1, marginBottom: 4,
                }}>
                  صلاة {adhan.nameAr}
                </div>
                <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums', direction: 'ltr', textAlign: 'right' }}>
                  {adhan.time}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(212,175,55,0.15)', marginBottom: 14 }} />

            {/* ====== الأزرار الثلاثة ====== */}
            <div style={{ display: 'flex', gap: 8 }}>

              {/* 🔇 كتم الأذان */}
              <button
                onClick={onMute}
                title={muted ? 'تشغيل الأذان' : 'كتم الأذان'}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: 14,
                  border: '1px solid rgba(212,175,55,0.25)',
                  background: muted ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.05)',
                  color: muted ? '#D4AF37' : 'rgba(255,255,255,0.55)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 20 }}>{muted ? '🔇' : '🔊'}</span>
                <span>{muted ? 'صوت مكتوم' : 'كتم الصوت'}</span>
              </button>

              {/* 🔒 قفل الشاشة */}
              <button
                onClick={handleLock}
                title={locked ? 'إلغاء قفل الشاشة' : 'قفل الشاشة'}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: 14,
                  border: '1px solid rgba(212,175,55,0.25)',
                  background: locked ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.05)',
                  color: locked ? '#D4AF37' : 'rgba(255,255,255,0.55)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 20 }}>{locked ? '🔒' : '🔓'}</span>
                <span>{locked ? 'الشاشة مقفولة' : 'قفل الشاشة'}</span>
              </button>

              {/* ✅ حسناً */}
              <button
                onClick={handleDismiss}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: 14,
                  border: 'none',
                  background: 'rgba(212,175,55,0.85)',
                  color: '#0d2318',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 20 }}>🕋</span>
                <span>حسناً</span>
              </button>

            </div>

            {/* رسالة حالة القفل */}
            {locked && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 12,
                  textAlign: 'center',
                  fontSize: 11,
                  color: 'rgba(212,175,55,0.5)',
                }}
              >
                🔒 الشاشة مقفولة — لن تختفي هذه النافذة تلقائياً
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}