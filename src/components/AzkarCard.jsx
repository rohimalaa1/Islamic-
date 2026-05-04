import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AzkarCard({ zikr, index }) {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(zikr.count);
  const [done, setDone] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const progress = ((zikr.count - current) / zikr.count) * 100;
  const circumference = 2 * Math.PI * 22;

  const handleCount = () => {
    if (done) return;
    setBouncing(true);
    setTimeout(() => setBouncing(false), 200);

    const next = current - 1;
    setCurrent(next);
    if (next === 0) setDone(true);
  };

  const handleReset = () => {
    setCurrent(zikr.count);
    setDone(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: done
          ? 'linear-gradient(135deg, rgba(45,106,79,0.2), rgba(45,106,79,0.05))'
          : 'var(--color-surface)',
        border: done ? '1px solid rgba(45,106,79,0.5)' : '1px solid var(--color-border)',
      }}
    >
      {/* Benefit badge */}
      <div className="text-xs mb-3 px-3 py-1 rounded-full inline-block"
        style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)' }}>
        ✨ {zikr.benefit}
      </div>

      {/* Arabic text */}
      <p className="arabic-text text-lg mb-3 leading-loose text-center" style={{ color: 'var(--color-text)' }}>
        {zikr.arabic}
      </p>

      {/* Translation */}
      {i18n.language === 'en' && (
        <p className="text-sm mb-4 text-center italic" style={{ color: 'var(--color-text-muted)' }}>
          {zikr.translation}
        </p>
      )}

      {/* Counter */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          {/* Circular progress */}
          <div className="relative" style={{ width: 56, height: 56 }}>
            <svg width="56" height="56" className="transform -rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="4" />
              <motion.circle
                cx="28" cy="28" r="22"
                fill="none"
                stroke={done ? '#2d6a4f' : 'var(--color-gold)'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
                transition={{ duration: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: done ? '#2d6a4f' : 'var(--color-gold)' }}>
                {current}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('count')}</div>
            <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {zikr.count - current} / {zikr.count}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {done ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <span style={{ color: '#2d6a4f' }} className="font-medium text-sm">{t('completed')}</span>
              <button onClick={handleReset} className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                {t('reset')}
              </button>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleCount}
              animate={{ scale: bouncing ? 0.9 : 1 }}
              whileTap={{ scale: 0.85 }}
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, var(--color-gold), var(--color-accent))',
                color: '#0d2318',
                boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
              }}
            >
              +
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
