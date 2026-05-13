import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

/* ─── constants ───────────────────────────────────────────── */
const HADITH = {
  text: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
  source: 'صحيح البخاري',
};

const TRACKABLE_PRAYERS = [
  { key: 'Fajr',    label: 'فجر'  },
  { key: 'Dhuhr',   label: 'ظهر'  },
  { key: 'Asr',     label: 'عصر'  },
  { key: 'Maghrib', label: 'مغرب' },
  { key: 'Isha',    label: 'عشاء' },
];

/* ─── sub-components ─────────────────────────────────────── */

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-12 h-6 rounded-full transition-all"
    style={{
      background: value ? 'var(--color-gold)' : 'var(--color-surface-2)',
      border: '1px solid var(--color-border)',
      flexShrink: 0,
    }}
  >
    <motion.div
      animate={{ x: value ? 24 : 2 }}
      className="absolute top-0.5 w-5 h-5 rounded-full"
      style={{ background: value ? '#0d2318' : 'var(--color-text-muted)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    />
  </button>
);

const Counter = ({ value, onChange, min = 1, max = 30 }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        fontSize: 18, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >−</button>
    <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, color: 'var(--color-gold)', fontSize: 16 }}>
      {value}
    </span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        fontSize: 18, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >+</button>
  </div>
);

/* ─── main page ──────────────────────────────────────────── */

export default function WirdPage() {
  const { t } = useTranslation();
  const {
    dailyWird, setDailyWird,
    wirdProgress, updateWirdProgress, incrementWirdProgress,
    prayersPerformed,
  } = useApp();

  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState(dailyWird);

  // ── prayer progress ─────────────────────────────────────
  const prayedCount = TRACKABLE_PRAYERS.filter(p => prayersPerformed[p.key] === 'prayed').length;
  const prayersDone = prayedCount === 5;
  const prayerPct   = Math.round((prayedCount / 5) * 100);

  // ── wird progress ───────────────────────────────────────
  const quranDone   = wirdProgress.quranPages || 0;
  const tasbihDone  = wirdProgress.tasbih     || 0;
  const morningDone = !!wirdProgress.azkarMorning;
  const eveningDone = !!wirdProgress.azkarEvening;

  // الصلوات دايمًا مهمة في الورد
  const totalGoals = 1
    + (dailyWird.quranPages > 0 ? 1 : 0)
    + (dailyWird.azkarMorning   ? 1 : 0)
    + (dailyWird.azkarEvening   ? 1 : 0)
    + (dailyWird.tasbih > 0     ? 1 : 0)
    + (dailyWird.customGoal     ? 1 : 0);

  const achieved = (prayersDone ? 1 : 0)
    + (quranDone  >= dailyWird.quranPages            ? 1 : 0)
    + (morningDone && dailyWird.azkarMorning         ? 1 : 0)
    + (eveningDone && dailyWird.azkarEvening         ? 1 : 0)
    + (tasbihDone >= dailyWird.tasbih && dailyWird.tasbih > 0 ? 1 : 0)
    + (wirdProgress.customGoal && dailyWird.customGoal        ? 1 : 0);

  const percent = totalGoals > 0 ? Math.round((achieved / totalGoals) * 100) : 0;

  const quranPct   = dailyWird.quranPages > 0
    ? Math.min(100, Math.round((quranDone / dailyWird.quranPages) * 100)) : 0;
  const tasbihPct  = dailyWird.tasbih > 0
    ? Math.min(100, Math.round((tasbihDone / dailyWird.tasbih) * 100)) : 0;
  const morningPct = morningDone ? 100 : 0;
  const eveningPct = eveningDone ? 100 : 0;

  // ── save settings ───────────────────────────────────────
  const saveSettings = () => {
    setDailyWird(draft);
    setShowSettings(false);
  };

  const today = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="pattern-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="px-4 py-4 space-y-4" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
              🌿 وردي اليومي
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{today}</p>
          </div>
          <button
            onClick={() => { setDraft(dailyWird); setShowSettings(s => !s); }}
            style={{
              padding: '6px 14px', borderRadius: 10,
              background: showSettings ? 'rgba(212,175,55,0.15)' : 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: showSettings ? 'var(--color-gold)' : 'var(--color-text-muted)',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            {showSettings ? '✕ إلغاء' : '⚙️ ضبط الورد'}
          </button>
        </motion.div>

        {/* ── Settings panel ── */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: -12 }}
              className="rounded-2xl p-4 space-y-1"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-gold)' }}>
                ⚙️ اضبط وردك اليومي
              </p>

              {/* Quran pages */}
              <div className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <span>📖</span>
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>صفحات القرآن يومياً</span>
                </div>
                <Counter
                  value={draft.quranPages}
                  onChange={v => setDraft(d => ({ ...d, quranPages: v }))}
                  min={0} max={30}
                />
              </div>

              {/* Morning azkar */}
              <div className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <span>🌅</span>
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>أذكار الصباح</span>
                </div>
                <Toggle value={draft.azkarMorning} onChange={v => setDraft(d => ({ ...d, azkarMorning: v }))} />
              </div>

              {/* Evening azkar */}
              <div className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <span>🌙</span>
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>أذكار المساء</span>
                </div>
                <Toggle value={draft.azkarEvening} onChange={v => setDraft(d => ({ ...d, azkarEvening: v }))} />
              </div>

              {/* Tasbih */}
              <div className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <span>📿</span>
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>هدف التسبيح</span>
                </div>
                <Counter
                  value={draft.tasbih}
                  onChange={v => setDraft(d => ({ ...d, tasbih: v }))}
                  min={0} max={1000}
                />
              </div>

              {/* Custom goal */}
              <div className="pt-3">
                <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>هدف مخصص (اختياري)</p>
                <input
                  value={draft.customGoal || ''}
                  onChange={e => setDraft(d => ({ ...d, customGoal: e.target.value }))}
                  placeholder="مثال: قراءة كتاب إسلامي، حفظ آية..."
                  style={{
                    width: '100%', padding: '10px 12px',
                    borderRadius: 12,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: 13, outline: 'none', direction: 'rtl',
                  }}
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={saveSettings}
                className="w-full py-3 rounded-xl font-bold text-sm mt-2"
                style={{ background: 'var(--color-gold)', color: '#0d2318', border: 'none', cursor: 'pointer' }}
              >
                حفظ الإعدادات
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Achievement summary ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-gold)' }}>إنجاز اليوم</span>
            <span className="text-sm font-bold" style={{ color: 'var(--color-gold)' }}>
              {achieved} / {totalGoals}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 8, borderRadius: 8, background: 'var(--color-surface-2)', overflow: 'hidden', marginBottom: 8 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 8, background: 'var(--color-gold)' }}
            />
          </div>
          <p className="text-xs text-center mb-4" style={{ color: 'var(--color-text-muted)' }}>
            {percent}% من وردك اليومي
          </p>

          {/* Stats grid — 5 columns now */}
          <div className="grid grid-cols-5 gap-1 text-center">
            {[
              { label: 'الصلوات', pct: prayerPct,   sub: `${prayedCount}/5`                          },
              { label: 'القرآن',  pct: quranPct,    sub: `${quranDone}/${dailyWird.quranPages} ص`    },
              { label: 'الصباح',  pct: morningPct,  sub: morningDone ? '✓' : '—'                     },
              { label: 'المساء',  pct: eveningPct,  sub: eveningDone ? '✓' : '—'                     },
              { label: 'التسبيح', pct: tasbihPct,   sub: `${tasbihDone}/${dailyWird.tasbih}`         },
            ].map(item => (
              <div key={item.label}>
                <p className="text-sm font-bold" style={{ color: 'var(--color-gold)' }}>{item.pct}%</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Prayer card — always shown, reads from PrayerPage ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
          className="rounded-2xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕌</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>الصلوات الخمس</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  سجّل من صفحة مواقيت الصلاة
                </p>
              </div>
            </div>
            <span className="font-bold text-sm" style={{ color: prayersDone ? '#4ade80' : 'var(--color-gold)' }}>
              {prayedCount}/5
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 6, background: 'var(--color-surface-2)', overflow: 'hidden', marginBottom: 14 }}>
            <motion.div
              animate={{ width: `${prayerPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 6, background: 'var(--color-gold)' }}
            />
          </div>

          {/* Prayer pills */}
          <div className="flex justify-between">
            {TRACKABLE_PRAYERS.map(({ key, label }) => {
              const status = prayersPerformed[key];
              return (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                      background: status === 'prayed'
                        ? 'rgba(45,106,79,0.25)'
                        : status === 'missed'
                        ? 'rgba(220,38,38,0.15)'
                        : 'var(--color-surface-2)',
                      color: status === 'prayed'
                        ? '#4ade80'
                        : status === 'missed'
                        ? '#f87171'
                        : 'var(--color-text-muted)',
                      border: `1px solid ${
                        status === 'prayed' ? 'rgba(45,106,79,0.4)'
                        : status === 'missed' ? 'rgba(220,38,38,0.3)'
                        : 'var(--color-border)'
                      }`,
                    }}
                  >
                    {status === 'prayed' ? '✓' : status === 'missed' ? '✕' : '·'}
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{label}</span>
                </div>
              );
            })}
          </div>

          {prayersDone && (
            <p className="text-center text-xs mt-3" style={{ color: '#4ade80' }}>
              ✓ أتممت الصلوات الخمس اليوم
            </p>
          )}
        </motion.div>

        {/* ── Quran card ── */}
        {dailyWird.quranPages > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>تلاوة القرآن الكريم</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    الهدف: {dailyWird.quranPages} صفحة يومياً
                  </p>
                </div>
              </div>
              <span className="font-bold" style={{ color: 'var(--color-gold)' }}>
                {quranDone}/{dailyWird.quranPages}
              </span>
            </div>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.96 }}
                onClick={() => incrementWirdProgress('quranPages', 1)}
                disabled={quranDone >= dailyWird.quranPages}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 12,
                  background: quranDone >= dailyWird.quranPages ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.15)',
                  border: '1px solid rgba(45,106,79,0.3)',
                  color: quranDone >= dailyWird.quranPages ? '#4ade80' : 'var(--color-gold)',
                  fontSize: 13, fontWeight: 600,
                  cursor: quranDone >= dailyWird.quranPages ? 'default' : 'pointer',
                }}>
                {quranDone >= dailyWird.quranPages ? '✓ أتممت التلاوة' : '+ قرأت صفحة'}
              </motion.button>
              <motion.button whileTap={{ scale: 0.96 }}
                onClick={() => updateWirdProgress('quranPages', 0)}
                style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  fontSize: 13, cursor: 'pointer',
                }}>
                إعادة
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Morning azkar card ── */}
        {dailyWird.azkarMorning && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🌅</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>أذكار الصباح</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>بعد صلاة الفجر</p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => updateWirdProgress('azkarMorning', !morningDone)}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 12,
                background: morningDone ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.08)',
                border: `1px solid ${morningDone ? 'rgba(45,106,79,0.4)' : 'var(--color-border)'}`,
                color: morningDone ? '#4ade80' : 'var(--color-gold)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
              {morningDone ? '✓ أنهيت أذكار الصباح' : 'أنهيت أذكار الصباح'}
            </motion.button>
          </motion.div>
        )}

        {/* ── Evening azkar card ── */}
        {dailyWird.azkarEvening && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🌙</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>أذكار المساء</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>بعد صلاة العصر أو المغرب</p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => updateWirdProgress('azkarEvening', !eveningDone)}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 12,
                background: eveningDone ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.08)',
                border: `1px solid ${eveningDone ? 'rgba(45,106,79,0.4)' : 'var(--color-border)'}`,
                color: eveningDone ? '#4ade80' : 'var(--color-gold)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
              {eveningDone ? '✓ أنهيت أذكار المساء' : 'أنهيت أذكار المساء'}
            </motion.button>
          </motion.div>
        )}

        {/* ── Tasbih card ── */}
        {dailyWird.tasbih > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📿</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>التسبيح اليومي</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    الهدف: {dailyWird.tasbih} تسبيحة
                  </p>
                </div>
              </div>
              <span className="font-bold text-sm"
                style={{ color: tasbihDone >= dailyWird.tasbih ? '#4ade80' : 'var(--color-gold)' }}>
                {tasbihDone}/{dailyWird.tasbih}
              </span>
            </div>

            <div style={{ height: 6, borderRadius: 6, background: 'var(--color-surface-2)', overflow: 'hidden', marginBottom: 12 }}>
              <motion.div
                animate={{ width: `${tasbihPct}%` }}
                style={{ height: '100%', borderRadius: 6, background: 'var(--color-gold)' }}
              />
            </div>

            <div className="flex gap-2">
              {[10, 33, 100].map(n => (
                <motion.button key={n} whileTap={{ scale: 0.94 }}
                  onClick={() => incrementWirdProgress('tasbih', n)}
                  disabled={tasbihDone >= dailyWird.tasbih}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12,
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    color: 'var(--color-gold)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>
                  +{n}
                </motion.button>
              ))}
            </div>

            {tasbihDone >= dailyWird.tasbih && (
              <p className="text-center text-xs mt-2" style={{ color: '#4ade80' }}>
                ✓ أتممت التسبيح اليوم
              </p>
            )}
          </motion.div>
        )}

        {/* ── Custom goal card ── */}
        {dailyWird.customGoal && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⭐</span>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{dailyWird.customGoal}</p>
            </div>
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => updateWirdProgress('customGoal', !wirdProgress.customGoal)}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 12,
                background: wirdProgress.customGoal ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.08)',
                border: `1px solid ${wirdProgress.customGoal ? 'rgba(45,106,79,0.4)' : 'var(--color-border)'}`,
                color: wirdProgress.customGoal ? '#4ade80' : 'var(--color-gold)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
              {wirdProgress.customGoal ? '✓ أنجزت الهدف' : 'أنجزت الهدف'}
            </motion.button>
          </motion.div>
        )}

        {/* ── Hadith quote ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-2xl p-4 text-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <p className="arabic-text text-sm leading-loose mb-1" style={{ color: 'var(--color-text)' }}>
            « {HADITH.text} »
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{HADITH.source}</p>
        </motion.div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}