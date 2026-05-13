import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, getLastDays } from '../context/AppContext';

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_AR = {
  Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر',
  Maghrib: 'المغرب', Isha: 'العشاء',
};
const PRAYER_ICONS = {
  Fajr: '🌅', Dhuhr: '🌞', Asr: '🌤️', Maghrib: '🌇', Isha: '🌙',
};
const DAY_AR = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const getDayData = (history, dateStr) => history[dateStr] || {};
const getDayStatus = (dayData, prayer) => dayData[prayer];

// ── Toast Component ──
function LiveToast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-4 left-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg"
          style={{
            transform: 'translateX(-50%)',
            background: toast.type === 'prayed'
              ? 'linear-gradient(135deg,rgba(34,197,94,0.18),rgba(74,222,128,0.12))'
              : 'linear-gradient(135deg,rgba(239,68,68,0.18),rgba(248,113,113,0.12))',
            border: toast.type === 'prayed'
              ? '1px solid rgba(74,222,128,0.4)'
              : '1px solid rgba(248,113,113,0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <span style={{ fontSize: 18 }}>{PRAYER_ICONS[toast.prayer]}</span>
          <div className="arabic-text text-sm leading-tight" style={{ color: '#fff' }}>
            <span style={{ fontWeight: 700 }}>{PRAYER_AR[toast.prayer]}</span>
            <span style={{ opacity: 0.75, marginRight: 4 }}>
              {toast.type === 'prayed' ? '— تم التسجيل ✅' : '— سُجِّلت كفائتة ❌'}
            </span>
          </div>
          <span className="text-xs arabic-text"
            style={{ color: toast.type === 'prayed' ? '#4ade80' : '#f87171', fontWeight: 700 }}>
            الإحصائيات تحدّثت
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function StatsPage() {
  const { prayerHistory, prayersPerformed } = useApp();
  const [view, setView] = useState('week');
  const [selectedPrayer, setSelectedPrayer] = useState(null);

  // ── Live update state ──
  const [toast, setToast] = useState(null);
  const [flashPrayer, setFlashPrayer] = useState(null); // prayer name that just changed
  const [ringKey, setRingKey] = useState(0);            // bump to re-animate ring
  const prevPerformed = useRef({});
  const toastTimer = useRef(null);

  // ── Watch prayersPerformed for changes ──
  useEffect(() => {
    const prev = prevPerformed.current;
    let changedPrayer = null;
    let changedType = null;

    for (const prayer of PRAYERS) {
      if (prev[prayer] !== prayersPerformed[prayer] && prayersPerformed[prayer]) {
        changedPrayer = prayer;
        changedType = prayersPerformed[prayer]; // 'prayed' | 'missed'
        break;
      }
    }

    if (changedPrayer) {
      // Show toast
      clearTimeout(toastTimer.current);
      const id = Date.now();
      setToast({ id, prayer: changedPrayer, type: changedType });
      toastTimer.current = setTimeout(() => setToast(null), 2800);

      // Flash the prayer bar
      setFlashPrayer(changedPrayer);
      setTimeout(() => setFlashPrayer(null), 900);

      // Re-animate the overall ring
      setRingKey(k => k + 1);
    }

    prevPerformed.current = { ...prayersPerformed };
  }, [prayersPerformed]);

  // Merge today's live data into history
  const fullHistory = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return { ...prayerHistory, [today]: prayersPerformed };
  }, [prayerHistory, prayersPerformed]);

  const days = useMemo(() => getLastDays(view === 'week' ? 7 : 30), [view]);

  const stats = useMemo(() => {
    const result = {};
    PRAYERS.forEach(p => {
      let done = 0, missed = 0, total = 0;
      days.forEach(d => {
        const s = getDayStatus(getDayData(fullHistory, d), p);
        if (s === 'prayed') done++;
        else if (s === 'missed') missed++;
        if (s) total++;
      });
      result[p] = { done, missed, total, pct: total ? Math.round((done / total) * 100) : null };
    });
    return result;
  }, [days, fullHistory]);

  const overall = useMemo(() => {
    let done = 0, missed = 0, total = 0;
    PRAYERS.forEach(p => { done += stats[p].done; missed += stats[p].missed; total += stats[p].total; });
    return { done, missed, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [stats]);

  const streak = useMemo(() => {
    const allDays = getLastDays(30).reverse();
    let count = 0;
    for (const d of allDays) {
      const dayData = getDayData(fullHistory, d);
      const allDone = PRAYERS.every(p => dayData[p] === 'prayed');
      if (allDone) count++; else break;
    }
    return count;
  }, [fullHistory]);

  const bestPrayer = useMemo(() =>
    PRAYERS.reduce((best, p) => (stats[p].done > (stats[best]?.done || 0)) ? p : best, PRAYERS[0]),
    [stats]
  );

  const weakPrayer = useMemo(() => {
    const withData = PRAYERS.filter(p => stats[p].total > 0);
    if (!withData.length) return null;
    return withData.reduce((weak, p) =>
      (stats[p].done < (stats[weak]?.done ?? Infinity)) ? p : weak, withData[0]
    );
  }, [stats]);

  return (
    <>
      {/* Live toast — floats above everything */}
      <LiveToast toast={toast} />

      <div className="px-4 py-4 space-y-4 pb-24">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
            📊 إحصائيات الصلوات
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            تابع انتظامك في الصلوات
          </p>
        </motion.div>

        {/* Week / Month toggle */}
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--color-surface)' }}>
          {[{ k: 'week', l: 'آخر 7 أيام' }, { k: 'month', l: 'آخر 30 يوم' }].map(tab => (
            <button key={tab.k} onClick={() => setView(tab.k)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium arabic-text transition-all relative">
              {view === tab.k && (
                <motion.div layoutId="stats-tab" className="absolute inset-0 rounded-lg"
                  style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10"
                style={{ color: view === tab.k ? 'var(--color-gold)' : 'var(--color-text-muted)' }}>
                {tab.l}
              </span>
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'صلوات مؤداة', value: overall.done,   color: '#4ade80' },
            { label: 'صلوات فائتة', value: overall.missed, color: '#f87171' },
            { label: 'سلسلة الأيام', value: `${streak}🔥`, color: 'var(--color-gold)' },
          ].map((card, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-3 text-center"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <motion.p
                key={`${card.value}-${ringKey}`}           // re-animate on update
                initial={{ scale: 1.35, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="text-2xl font-bold" style={{ color: card.color }}>
                {card.value}
              </motion.p>
              <p className="text-xs mt-1 arabic-text"
                style={{ color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                {card.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Overall progress ring */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-5 flex items-center gap-5"
          style={{
            background: 'linear-gradient(135deg,var(--color-surface),var(--color-surface-2))',
            border: '1px solid var(--color-border)',
          }}>
          <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
            <svg width="90" height="90">
              <circle cx="45" cy="45" r="38" fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <motion.circle cx="45" cy="45" r="38" fill="none"
                key={ringKey}                               // re-animate when prayer changes
                stroke={overall.pct >= 80 ? '#4ade80' : overall.pct >= 50 ? 'var(--color-gold)' : '#f87171'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 38}
                initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - overall.pct / 100) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span key={`pct-${overall.pct}`}
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-lg font-bold"
                style={{ color: overall.pct >= 80 ? '#4ade80' : overall.pct >= 50 ? 'var(--color-gold)' : '#f87171' }}>
                {overall.pct}%
              </motion.span>
            </div>
          </div>

          <div className="flex-1">
            <p className="font-bold arabic-text mb-1" style={{ color: 'var(--color-gold)' }}>
              {overall.pct >= 90 ? '🌟 ممتاز! استمر' :
               overall.pct >= 70 ? '👍 جيد! يمكنك الأفضل' :
               overall.pct >= 50 ? '⚡ تحتاج مجهود أكثر' : '🤲 لا تستسلم، ابدأ الآن'}
            </p>
            <p className="text-sm arabic-text" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              أديت {overall.done} من أصل {overall.total} صلاة مسجّلة
              {view === 'week' ? ' هذا الأسبوع' : ' هذا الشهر'}
            </p>
            {bestPrayer && (
              <p className="text-xs mt-1" style={{ color: '#4ade80' }}>
                {PRAYER_ICONS[bestPrayer]} أقوى صلاة: {PRAYER_AR[bestPrayer]}
              </p>
            )}
            {weakPrayer && weakPrayer !== bestPrayer && (
              <p className="text-xs mt-0.5" style={{ color: '#f87171' }}>
                {PRAYER_ICONS[weakPrayer]} تحتاج اهتمام: {PRAYER_AR[weakPrayer]}
              </p>
            )}
          </div>
        </motion.div>

        {/* Per-prayer bars */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="font-bold text-sm arabic-text" style={{ color: 'var(--color-gold)' }}>
              📈 تفصيل كل صلاة
            </h2>
          </div>
          <div className="p-3 space-y-3">
            {PRAYERS.map((prayer, i) => {
              const s = stats[prayer];
              const pct = s.total ? (s.done / s.total) * 100 : 0;
              const isSelected = selectedPrayer === prayer;
              const isFlashing = flashPrayer === prayer;

              return (
                <motion.button key={prayer}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedPrayer(isSelected ? null : prayer)}
                  className="w-full text-right rounded-xl p-3 transition-all"
                  style={{
                    background: isFlashing
                      ? 'rgba(212,175,55,0.14)'
                      : isSelected ? 'rgba(212,175,55,0.08)' : 'var(--color-surface-2)',
                    border: `1px solid ${isFlashing
                      ? 'rgba(212,175,55,0.6)'
                      : isSelected ? 'rgba(212,175,55,0.3)' : 'var(--color-border)'}`,
                    boxShadow: isFlashing ? '0 0 12px rgba(212,175,55,0.25)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        key={`done-${s.done}-${prayer}`}
                        initial={isFlashing ? { scale: 1.4, color: '#4ade80' } : {}}
                        animate={{ scale: 1 }}
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(45,106,79,0.2)', color: '#4ade80' }}>
                        ✓ {s.done}
                      </motion.span>
                      {s.missed > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                          ✗ {s.missed}
                        </span>
                      )}
                      {s.total === 0 && (
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>لا توجد بيانات</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold"
                        style={{ color: pct >= 80 ? '#4ade80' : pct >= 50 ? 'var(--color-gold)' : '#f87171' }}>
                        {s.total ? `${Math.round(pct)}%` : '—'}
                      </span>
                      <span className="font-semibold arabic-text text-sm"
                        style={{ color: 'var(--color-text)' }}>
                        {PRAYER_ICONS[prayer]} {PRAYER_AR[prayer]}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full"
                      key={`bar-${s.done}-${prayer}`}      // re-animate bar on change
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{
                        background: pct >= 80
                          ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                          : pct >= 50
                          ? 'linear-gradient(90deg,var(--color-gold),var(--color-accent))'
                          : 'linear-gradient(90deg,#ef4444,#f87171)',
                      }} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 7-day grid heatmap */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="font-bold text-sm arabic-text" style={{ color: 'var(--color-gold)' }}>
              🗓️ سجل الأيام
            </h2>
          </div>
          <div className="p-3 overflow-x-auto">
            <table className="w-full text-center" style={{ minWidth: view === 'month' ? 500 : 'auto' }}>
              <thead>
                <tr>
                  <td className="text-xs py-1 arabic-text pr-2"
                    style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>الصلاة</td>
                  {days.slice(-7).map(d => {
                    const date = new Date(d);
                    return (
                      <td key={d} className="text-xs py-1 px-1"
                        style={{ color: 'var(--color-text-muted)', minWidth: 32 }}>
                        {DAY_AR[date.getDay()].slice(0, 3)}<br />
                        <span style={{ fontSize: 9 }}>{date.getDate()}</span>
                      </td>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {PRAYERS.map(prayer => (
                  <tr key={prayer}>
                    <td className="text-xs py-1 arabic-text pr-2 text-right"
                      style={{ color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                      {PRAYER_ICONS[prayer]} {PRAYER_AR[prayer]}
                    </td>
                    {days.slice(-7).map(d => {
                      const s = getDayStatus(getDayData(fullHistory, d), prayer);
                      const isToday = d === new Date().toISOString().slice(0, 10);
                      const isJustChanged = isToday && flashPrayer === prayer;
                      return (
                        <td key={d} className="py-1 px-1">
                          <motion.div
                            key={`cell-${d}-${prayer}-${s}`}
                            animate={isJustChanged ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-7 h-7 rounded-lg mx-auto flex items-center justify-center text-xs"
                            style={{
                              background: s === 'prayed'   ? 'rgba(45,106,79,0.35)'
                                        : s === 'missed' ? 'rgba(239,68,68,0.2)'
                                        : 'rgba(255,255,255,0.04)',
                              border: s === 'prayed'   ? '1px solid rgba(74,222,128,0.4)'
                                    : s === 'missed' ? '1px solid rgba(248,113,113,0.3)'
                                    : '1px solid var(--color-border)',
                            }}>
                            {s === 'prayed' ? '✓' : s === 'missed' ? '✗' : '·'}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="px-4 pb-3 flex items-center justify-center gap-4">
            {[
              { color: 'rgba(45,106,79,0.35)',    border: 'rgba(74,222,128,0.4)',  label: 'أُدِّيت',    icon: '✓' },
              { color: 'rgba(239,68,68,0.2)',     border: 'rgba(248,113,113,0.3)', label: 'فاتت',      icon: '✗' },
              { color: 'rgba(255,255,255,0.04)',  border: 'var(--color-border)',   label: 'غير مسجّل', icon: '·' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs"
                  style={{ background: l.color, border: `1px solid ${l.border}` }}>
                  {l.icon}
                </div>
                <span className="text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly heatmap dots (month view only) */}
        {view === 'month' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="font-bold text-sm arabic-text mb-3" style={{ color: 'var(--color-gold)' }}>
              🔥 نسبة الإنجاز اليومي (30 يوم)
            </h2>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {days.map(d => {
                const dayData = getDayData(fullHistory, d);
                const done  = PRAYERS.filter(p => dayData[p] === 'prayed').length;
                const total = PRAYERS.filter(p => dayData[p]).length;
                const pct   = total ? done / total : 0;
                const date  = new Date(d);
                return (
                  <motion.div key={d} title={`${d}: ${done}/${total || 5}`}
                    key={`dot-${d}-${done}`}
                    animate={{ scale: flashPrayer && d === new Date().toISOString().slice(0, 10) ? [1, 1.25, 1] : 1 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-md flex items-center justify-center"
                    style={{
                      width: 28, height: 28,
                      background: total === 0 ? 'rgba(255,255,255,0.04)'
                                : pct === 1   ? 'rgba(34,197,94,0.6)'
                                : pct >= 0.6  ? 'rgba(212,175,55,0.5)'
                                : pct >= 0.3  ? 'rgba(239,168,68,0.3)'
                                : 'rgba(239,68,68,0.25)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{date.getDate()}</span>
                  </motion.div>
                );
              })}
            </div>
            {/* Color scale legend */}
            <div className="flex items-center justify-center gap-1 mt-3">
              <span className="text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>أقل</span>
              {['rgba(255,255,255,0.04)', 'rgba(239,68,68,0.25)', 'rgba(239,168,68,0.3)',
                'rgba(212,175,55,0.5)', 'rgba(34,197,94,0.6)'].map((c, i) => (
                <div key={i} className="w-5 h-3 rounded-sm"
                  style={{ background: c, border: '1px solid rgba(255,255,255,0.07)' }} />
              ))}
              <span className="text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>أكثر</span>
            </div>
          </motion.div>
        )}

        {/* Motivational tip */}
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <p className="arabic-text text-sm leading-loose"
            style={{ color: 'var(--color-text-muted)', lineHeight: 2 }}>
            ❝ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ ❞
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
            سورة العنكبوت — آية 45
          </p>
        </div>

      </div>
    </>
  );
}