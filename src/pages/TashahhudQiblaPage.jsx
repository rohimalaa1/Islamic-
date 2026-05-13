import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { tashahudan } from '../data/tashahhud';
import { useApp } from '../context/AppContext';

/* ══════════════════════════════════════
   QIBLA COMPASS
══════════════════════════════════════ */
function QiblaCompass() {
  const { location } = useApp();
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [heading, setHeading]       = useState(null);
  const [permErr, setPermErr]       = useState(false);
  const [loading, setLoading]       = useState(true);
  const watchRef = useRef(null);

  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  const calcQibla = (lat, lng) => {
    const φ1 = (lat * Math.PI) / 180;
    const φ2 = (KAABA_LAT * Math.PI) / 180;
    const Δλ = ((KAABA_LNG - lng) * Math.PI) / 180;
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  useEffect(() => {
    const getPos = () => {
      if (location) {
        setQiblaAngle(calcQibla(location.lat, location.lng));
        setLoading(false);
        return;
      }
      if (!navigator.geolocation) { setLoading(false); return; }
      navigator.geolocation.getCurrentPosition(
        pos => {
          setQiblaAngle(calcQibla(pos.coords.latitude, pos.coords.longitude));
          setLoading(false);
        },
        () => setLoading(false),
        { timeout: 8000 }
      );
    };
    getPos();
  }, [location]);

  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.webkitCompassHeading !== undefined) {
        setHeading(e.webkitCompassHeading);
      } else if (e.alpha !== null) {
        setHeading(360 - e.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(res => {
            if (res === 'granted') window.addEventListener('deviceorientation', handleOrientation);
            else setPermErr(true);
          })
          .catch(() => setPermErr(true));
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const needleAngle = qiblaAngle !== null && heading !== null
    ? qiblaAngle - heading
    : qiblaAngle ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2"
          style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>جارٍ تحديد الموقع...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Compass */}
      <div className="relative" style={{ width: 240, height: 240 }}>
        <div className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }} />

        {[{ label: 'ش', deg: 0 }, { label: 'ق', deg: 90 }, { label: 'ج', deg: 180 }, { label: 'غ', deg: 270 }].map(({ label, deg }) => {
          const rad = (deg - 90) * Math.PI / 180;
          const r = 100;
          const x = 120 + r * Math.cos(rad);
          const y = 120 + r * Math.sin(rad);
          return (
            <div key={deg} className="absolute text-xs font-bold"
              style={{ left: x - 8, top: y - 8, color: deg === 0 ? 'var(--color-gold)' : 'var(--color-text-muted)', width: 16, textAlign: 'center' }}>
              {label}
            </div>
          );
        })}

        {Array.from({ length: 36 }, (_, i) => {
          const deg = i * 10;
          const rad = (deg - 90) * Math.PI / 180;
          const r1 = 85, r2 = i % 3 === 0 ? 78 : 82;
          return (
            <svg key={i} className="absolute inset-0" width="240" height="240" style={{ overflow: 'visible' }}>
              <line
                x1={120 + r1 * Math.cos(rad)} y1={120 + r1 * Math.sin(rad)}
                x2={120 + r2 * Math.cos(rad)} y2={120 + r2 * Math.sin(rad)}
                stroke="var(--color-border)" strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
              />
            </svg>
          );
        })}

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: needleAngle }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        >
          <svg width="240" height="240" className="absolute inset-0">
            <polygon points="120,40 114,120 126,120" fill="var(--color-gold)" opacity="0.9" />
            <polygon points="120,200 114,120 126,120" fill="rgba(150,150,150,0.4)" />
          </svg>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center z-10"
            style={{ background: 'var(--color-surface)', border: '2px solid var(--color-gold)' }}>
            <span className="text-xl">🕋</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        {qiblaAngle !== null ? (
          <>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>
              {Math.round(qiblaAngle)}°
            </p>
            <p className="text-sm mt-1 arabic-text" style={{ color: 'var(--color-text-muted)' }}>
              اتجاه القبلة من موقعك
            </p>
            {heading === null && (
              <p className="text-xs mt-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)' }}>
                💡 وجّه هاتفك حتى تتحرك الإبرة تلقائياً
              </p>
            )}
          </>
        ) : (
          <p className="text-sm arabic-text" style={{ color: 'var(--color-text-muted)' }}>
            تعذّر تحديد الموقع — تحقق من إذن الموقع
          </p>
        )}
        {permErr && (
          <p className="text-xs mt-2" style={{ color: '#f87171' }}>
            ⚠️ يرجى السماح بالوصول للبوصلة من إعدادات المتصفح
          </p>
        )}
      </div>

      {/* Kaaba info */}
      <div className="w-full rounded-xl p-3 text-center"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <p className="text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>
          📍 الكعبة المشرفة — مكة المكرمة
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          21.4225° N, 39.8262° E
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   TASHAHHUD CARD
══════════════════════════════════════ */
function TashahhudCard({ item }) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--color-border)' }}>

      <div className="px-5 py-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface-2))' }}>
        <span className="text-2xl">{item.icon}</span>
        <div>
          <h3 className="font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>{item.title}</h3>
          <p className="text-xs arabic-text mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{item.when}</p>
        </div>
      </div>

      <div className="px-5 py-5" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center mb-2" style={{ color: 'rgba(212,175,55,0.4)', fontSize: '1.4rem' }}>❝</div>
        <p className="arabic-text text-lg leading-loose text-center"
          style={{ color: 'var(--color-text)', lineHeight: 2.4, fontSize: '1.15rem' }}>
          {item.arabic}
        </p>
        <div className="text-center mt-2" style={{ color: 'rgba(212,175,55,0.4)', fontSize: '1.4rem' }}>❞</div>

        <button onClick={() => setShowTranslation(v => !v)}
          className="w-full mt-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{
            background: showTranslation ? 'rgba(212,175,55,0.1)' : 'var(--color-surface-2)',
            color: showTranslation ? 'var(--color-gold)' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
          }}>
          {showTranslation ? '▲ إخفاء الترجمة' : '▼ عرض الترجمة'}
        </button>

        <AnimatePresence>
          {showTranslation && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm italic text-center mt-3 leading-relaxed"
              style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              {item.translation}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {item.ibrahimiyyah && (
        <div className="px-5 py-4"
          style={{ background: 'rgba(45,106,79,0.06)', borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: '#4ade80' }}>
            🌿 {item.ibrahimiyyah.title}
          </p>
          <p className="arabic-text text-base leading-loose text-center"
            style={{ color: 'var(--color-text)', lineHeight: 2.2 }}>
            {item.ibrahimiyyah.arabic}
          </p>
        </div>
      )}

      {item.duaAfter && (
        <div className="px-5 py-4"
          style={{ background: 'rgba(100,60,180,0.06)', borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#a78bfa' }}>
            🤲 {item.duaAfter.title}
          </p>
          <p className="arabic-text text-base leading-loose text-center"
            style={{ color: 'var(--color-text)', lineHeight: 2.2 }}>
            {item.duaAfter.arabic}
          </p>
        </div>
      )}

      <div className="px-5 py-4" style={{ background: 'var(--color-surface-2)', borderTop: '1px solid var(--color-border)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>📌 ملاحظات</p>
        {item.notes.map((n, i) => (
          <div key={i} className="flex items-start gap-2 mb-1.5">
            <span style={{ color: 'var(--color-gold)', fontSize: '10px', marginTop: 4 }}>✦</span>
            <p className="arabic-text text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>{n}</p>
          </div>
        ))}
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--color-text-muted)' }}>
          📚 {item.source} — عن {item.narrator}
        </p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function TashahhudQiblaPage() {
  const [activeTab, setActiveTab] = useState('tashahhud');

  const tabs = [
    { key: 'tashahhud', label: 'التشهدان', icon: '🤲' },
    { key: 'qibla',     label: 'القبلة',   icon: '🕋' },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="pattern-overlay" style={{ zIndex: 0 }} />

      <div className="px-4 py-4 space-y-4" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
            {activeTab === 'tashahhud' ? '🤲 التشهدان' : '🕋 اتجاه القبلة'}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {activeTab === 'tashahhud' ? 'التشهد الأول والأخير والصلاة الإبراهيمية' : 'بوصلة القبلة نحو الكعبة المشرفة'}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--color-surface)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all relative">
              {activeTab === tab.key && (
                <motion.div layoutId="tq-tab" className="absolute inset-0 rounded-lg"
                  style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10 arabic-text"
                style={{ color: activeTab === tab.key ? 'var(--color-gold)' : 'var(--color-text-muted)' }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'tashahhud' ? (
            <motion.div key="tashahhud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-5">
              {tashahudan.map(item => <TashahhudCard key={item.id} item={item} />)}
            </motion.div>
          ) : (
            <motion.div key="qibla" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <QiblaCompass />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}