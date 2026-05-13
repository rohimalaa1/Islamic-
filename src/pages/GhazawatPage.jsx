import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ghazawat } from '../data/ghazawat';

const ResultBadge = ({ type, label }) => {
  const styles = {
    victory: { bg: 'rgba(45,106,79,0.2)', color: '#4ade80', border: 'rgba(45,106,79,0.4)' },
    setback: { bg: 'rgba(220,100,50,0.15)', color: '#fb923c', border: 'rgba(220,100,50,0.3)' },
  };
  const s = styles[type] || styles.victory;
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {label}
    </span>
  );
};

export default function GhazawatPage() {
  const [selected, setSelected] = useState(null);

  return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
    <div className="pattern-overlay" style={{ zIndex: 0 }} />
    
    <div className="px-4 py-4 space-y-5" style={{ position: 'relative', zIndex: 1 }}></div>
    <div className="px-4 py-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          ⚔️ غزوات النبي ﷺ
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {ghazawat.length} غزوة من سيرة النبي الكريم ﷺ
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selected ? (
          /* ── List ── */
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3">
            {ghazawat.map((g, i) => (
              <motion.button key={g.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(g)}
                className="w-full text-right rounded-2xl p-4 transition-all"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Number */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-gold)' }}>
                    {g.id}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-between gap-2">
                      <ResultBadge type={g.resultType} label={g.result} />
                      <span className="font-bold arabic-text text-base"
                        style={{ color: 'var(--color-text)' }}>
                        {g.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-1">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        📍 {g.location}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        📅 {g.year}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <span className="text-2xl flex-shrink-0">{g.icon}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          /* ── Detail ── */
          <motion.div key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4">

            {/* Back button */}
            <button onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
              ← العودة للقائمة
            </button>

            {/* Header card */}
            <div className="rounded-2xl p-5 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 0 40px rgba(212,175,55,0.08)',
              }}>
              <div className="absolute inset-0 opacity-5 pattern-overlay" />
              <span className="text-5xl">{selected.icon}</span>
              <h2 className="text-xl font-bold arabic-text mt-3 mb-1"
                style={{ color: 'var(--color-gold)' }}>
                {selected.name}
              </h2>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {selected.nameEn}
              </p>
              <ResultBadge type={selected.resultType} label={selected.result} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'التاريخ', value: selected.year, icon: '📅' },
                { label: 'الشهر', value: selected.month, icon: '🌙' },
                { label: 'الموقع', value: selected.location, icon: '📍' },
                { label: 'الشهداء', value: `${selected.martyrs} شهيد`, icon: '🌹' },
                { label: 'عدد المسلمين', value: selected.muslimCount, icon: '🟢' },
                { label: 'عدد العدو', value: selected.enemyCount, icon: '🔴' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-3"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{stat.icon}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</span>
                  </div>
                  <p className="text-sm font-semibold arabic-text" style={{ color: 'var(--color-text)' }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="rounded-2xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-gold)' }}>
                📖 نبذة عن الغزوة
              </h3>
              <p className="arabic-text leading-loose text-sm" style={{ color: 'var(--color-text)', lineHeight: 2 }}>
                {selected.description}
              </p>
            </div>

            {/* Key Events */}
            <div className="rounded-2xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-gold)' }}>
                ⭐ أبرز الأحداث
              </h3>
              <div className="space-y-2">
                {selected.keyEvents.map((event, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold"
                      style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                      {i + 1}
                    </span>
                    <p className="arabic-text text-sm leading-relaxed flex-1"
                      style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>
                      {event}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quran reference */}
            {selected.quranRef && (
              <div className="rounded-2xl p-5 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,106,79,0.1), rgba(45,106,79,0.05))',
                  border: '1px solid rgba(45,106,79,0.3)',
                }}>
                <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>📗 ذُكرت في القرآن الكريم</p>
                <p className="arabic-text text-sm leading-loose" style={{ color: '#4ade80', lineHeight: 2 }}>
                  {selected.quranRef}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
