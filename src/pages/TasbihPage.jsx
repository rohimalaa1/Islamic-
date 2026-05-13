import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const TASBIH_PRESETS = [
  { id: 1, arabic: 'سُبْحَانَ اللَّهِ',          label: 'سبحان الله',        target: 33,  color: '#2d6a4f', glow: 'rgba(45,106,79,0.5)',   wirdKey: 'tasbih'   },
  { id: 2, arabic: 'الْحَمْدُ لِلَّهِ',           label: 'الحمد لله',         target: 33,  color: '#b8860b', glow: 'rgba(184,134,11,0.5)', wirdKey: 'tasbih'   },
  { id: 3, arabic: 'اللَّهُ أَكْبَرُ',            label: 'الله أكبر',         target: 34,  color: '#6b3fa0', glow: 'rgba(107,63,160,0.5)', wirdKey: 'tasbih'   },
  { id: 4, arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', label: 'لا إله إلا الله',   target: 100, color: '#b5451b', glow: 'rgba(181,69,27,0.5)',  wirdKey: 'tasbih'   },
  { id: 5, arabic: 'أَسْتَغْفِرُ اللَّهَ',        label: 'استغفر الله',       target: 100, color: '#1a5276', glow: 'rgba(26,82,118,0.5)',  wirdKey: null       },
  { id: 6, arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', label: 'لا حول ولا قوة', target: 100, color: '#145a32', glow: 'rgba(20,90,50,0.5)',   wirdKey: null },
  { id: 7, arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', label: 'الصلاة على النبي', target: 100, color: '#7d6608', glow: 'rgba(125,102,8,0.5)', wirdKey: 'salawat' },
  { id: 8, arabic: 'custom', label: 'مخصص', target: 33, color: '#555', glow: 'rgba(150,150,150,0.3)', wirdKey: null },
];

const BEAD_COUNT = 33;
const beadPositions = Array.from({ length: BEAD_COUNT }, (_, i) => {
  const angle = (i / BEAD_COUNT) * 2 * Math.PI - Math.PI / 2;
  return { x: Math.cos(angle), y: Math.sin(angle) };
});

export default function TasbihPage() {
  const { wirdProgress, incrementWirdProgress } = useApp();

  const [selected, setSelected]     = useState(TASBIH_PRESETS[0]);
  const [count, setCount]           = useState(0);
  const [total, setTotal]           = useState(0);
  const [rounds, setRounds]         = useState(0);
  const [showDone, setShowDone]     = useState(false);
  const [ripples, setRipples]       = useState([]);
  const [vibrate, setVibrate]       = useState(true);
  const [customText, setCustomText] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const rippleId = useRef(0);

  const target = selected.id === 8 ? (parseInt(customText) || 33) : selected.target;
  const progress = Math.min((count / target) * 100, 100);
  const circumference = 2 * Math.PI * 110;

  // ── مزامنة مع الورد اليومي ✅ تم إضافة amount=1 ──
  const syncWird = useCallback((preset) => {
    if (!preset.wirdKey) return;
    incrementWirdProgress(preset.wirdKey, 1);
  }, [incrementWirdProgress]);

  const handleCount = useCallback(() => {
    if (vibrate && navigator.vibrate) navigator.vibrate(30);

    const id = rippleId.current++;
    setRipples(r => [...r, id]);
    setTimeout(() => setRipples(r => r.filter(x => x !== id)), 600);

    const next = count + 1;
    setTotal(t => t + 1);

    // مزامنة الورد
    syncWird(selected);

    if (next >= target) {
      setCount(0);
      setRounds(r => r + 1);
      setShowDone(true);
      setTimeout(() => setShowDone(false), 1500);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100]);
    } else {
      setCount(next);
    }
  }, [count, target, vibrate, selected, syncWird]);

  const reset = () => { setCount(0); setTotal(0); setRounds(0); };

  const selectPreset = (p) => {
    setSelected(p);
    setCount(0);
    setRounds(0);
    setShowPresets(false);
    if (p.id === 8) setShowCustom(true);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleCount(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleCount]);

  const activeColor = selected.color;
  const activeGlow  = selected.glow;

  // قيم الورد الحالية لعرضها
  const tasbihWird  = wirdProgress.tasbih  || 0;
  const salawatWird = wirdProgress.salawat || 0;

  return (
    <div className="px-4 py-4 flex flex-col items-center min-h-screen" style={{ paddingBottom: 90 }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full text-right mb-4">
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          📿 السبحة الإلكترونية
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          اضغط الزر أو مفتاح المسافة للتسبيح
        </p>
      </motion.div>

      {/* ── مؤشر الورد اليومي ── */}
      {selected.wirdKey && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full mb-4 px-4 py-2.5 rounded-xl flex items-center justify-between"
          style={{ background: `${activeColor}15`, border: `1px solid ${activeColor}44` }}>
          <span className="text-sm font-bold" style={{ color: activeColor }}>
            {selected.wirdKey === 'salawat' ? salawatWird : tasbihWird}
          </span>
          <span className="arabic-text text-xs" style={{ color: activeColor }}>
            ✓ محسوب في الورد اليومي
          </span>
        </motion.div>
      )}

      {/* Preset selector */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => setShowPresets(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl mb-4 transition-all"
        style={{
          background: 'var(--color-surface)',
          border: `1px solid ${showPresets ? activeColor : 'var(--color-border)'}`,
        }}>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {showPresets ? '▲ إغلاق' : '▼ اختر ذكراً'}
        </span>
        <span className="arabic-text font-bold text-sm" style={{ color: activeColor }}>
          {selected.id === 8 ? 'مخصص' : selected.label}
        </span>
      </motion.button>

      <AnimatePresence>
        {showPresets && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full mb-4 overflow-hidden rounded-2xl"
            style={{ border: '1px solid var(--color-border)' }}>
            <div className="grid grid-cols-2 gap-0">
              {TASBIH_PRESETS.map((p, i) => (
                <button key={p.id} onClick={() => selectPreset(p)}
                  className="px-3 py-3 text-right arabic-text text-sm transition-all"
                  style={{
                    background: selected.id === p.id ? `${p.color}22` : 'var(--color-surface)',
                    color: selected.id === p.id ? p.color : 'var(--color-text)',
                    borderBottom: i < 6 ? '1px solid var(--color-border)' : 'none',
                    borderRight: i % 2 === 0 ? '1px solid var(--color-border)' : 'none',
                    fontWeight: selected.id === p.id ? '700' : '400',
                  }}>
                  {p.label}
                  {/* بيج الورد */}
                  {p.wirdKey && (
                    <span className="text-xs opacity-60 mr-1">
                      ({p.wirdKey === 'salawat' ? salawatWird : tasbihWird}✓)
                    </span>
                  )}
                  {selected.id === p.id && ' ✓'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom input */}
      {selected.id === 8 && showCustom && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full mb-4 rounded-xl p-3 flex gap-2"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <input value={customText} onChange={e => setCustomText(e.target.value)}
            placeholder="اكتب الذكر..."
            className="flex-1 px-3 py-2 rounded-lg text-right arabic-text text-sm outline-none"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          />
          <button onClick={() => setShowCustom(false)}
            className="px-3 rounded-lg text-sm"
            style={{ background: activeColor, color: '#fff' }}>
            حفظ
          </button>
        </motion.div>
      )}

      {/* Stats row */}
      <div className="w-full grid grid-cols-3 gap-2 mb-6">
        {[
          { label: 'العدد',    value: count,  highlight: true  },
          { label: 'الجولات', value: rounds, highlight: false },
          { label: 'الإجمالي', value: total, highlight: false },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-3 text-center"
            style={{
              background: stat.highlight ? `${activeColor}18` : 'var(--color-surface)',
              border: `1px solid ${stat.highlight ? activeColor + '44' : 'var(--color-border)'}`,
            }}>
            <motion.p key={stat.value}
              initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold"
              style={{ color: stat.highlight ? activeColor : 'var(--color-text)' }}>
              {stat.value}
            </motion.p>
            <p className="text-xs mt-0.5 arabic-text" style={{ color: 'var(--color-text-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main tasbih button */}
      <div className="relative flex items-center justify-center mb-6" style={{ width: 280, height: 280 }}>

        {/* Bead ring */}
        <svg width="280" height="280" className="absolute inset-0">
          {beadPositions.map((pos, i) => {
            const cx = 140 + pos.x * 118;
            const cy = 140 + pos.y * 118;
            const filled = i < (count % BEAD_COUNT) || (count > 0 && count >= target);
            return (
              <motion.circle key={i} cx={cx} cy={cy} r={5}
                fill={filled ? activeColor : 'var(--color-surface-2)'}
                stroke={filled ? activeColor : 'var(--color-border)'}
                strokeWidth={1}
                animate={{ scale: filled ? 1.2 : 1, opacity: filled ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
              />
            );
          })}
        </svg>

        {/* Progress ring */}
        <svg width="260" height="260" className="absolute" style={{ left: 10, top: 10 }}>
          <circle cx="130" cy="130" r="110" fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle cx="130" cy="130" r="110" fill="none"
            stroke={activeColor} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '130px 130px' }}
          />
        </svg>

        {/* Ripples */}
        {ripples.map(id => (
          <motion.div key={id}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute rounded-full pointer-events-none"
            style={{ width: 180, height: 180, background: `${activeColor}33`, border: `2px solid ${activeColor}66` }}
          />
        ))}

        <AnimatePresence>
          {showDone && (
            <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.3, opacity: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute rounded-full pointer-events-none"
              style={{ width: 200, height: 200, background: `${activeColor}55` }} />
          )}
        </AnimatePresence>

        {/* Big tap button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleCount}
          className="relative z-10 rounded-full flex flex-col items-center justify-center select-none"
          style={{
            width: 180, height: 180,
            background: `radial-gradient(circle at 40% 35%, ${activeColor}dd, ${activeColor}88)`,
            boxShadow: `0 0 0 4px ${activeColor}33, 0 8px 40px ${activeGlow}, 0 0 80px ${activeColor}22`,
            border: `2px solid ${activeColor}99`,
            cursor: 'pointer',
            userSelect: 'none',
          }}>
          <p className="arabic-text text-center font-bold text-white leading-tight px-3"
            style={{ fontSize: selected.arabic.length > 20 ? '0.8rem' : '1rem', lineHeight: 1.8, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {selected.id === 8 ? (customText || 'اكتب ذكراً') : selected.arabic}
          </p>
          <motion.p key={count}
            initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-white font-bold mt-1"
            style={{ fontSize: '1.8rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {count}
          </motion.p>
          <p className="text-white text-xs opacity-70 mt-0.5">/ {target}</p>
        </motion.button>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {showDone && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl"
            style={{ background: activeColor, boxShadow: `0 8px 30px ${activeGlow}` }}>
            <p className="text-white font-bold arabic-text text-sm">
              🎉 اكتملت جولة! ({rounds + 1})
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dhikr info */}
      <div className="w-full rounded-2xl p-4 mb-4 text-center"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <p className="arabic-text text-base font-bold mb-1" style={{ color: activeColor }}>
          {selected.id === 8 ? (customText || '—') : selected.arabic}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          الهدف: {target} مرة لكل جولة
        </p>
      </div>

      {/* Controls */}
      <div className="w-full flex gap-3">
        <button onClick={() => setVibrate(v => !v)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all"
          style={{
            background: vibrate ? 'rgba(45,106,79,0.15)' : 'var(--color-surface)',
            border: `1px solid ${vibrate ? 'rgba(45,106,79,0.4)' : 'var(--color-border)'}`,
            color: vibrate ? '#4ade80' : 'var(--color-text-muted)',
          }}>
          <span>{vibrate ? '📳' : '🔕'}</span>
          <span className="arabic-text">{vibrate ? 'اهتزاز' : 'بدون اهتزاز'}</span>
        </button>

        <button onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
          <span>🔄</span>
          <span className="arabic-text">إعادة</span>
        </button>
      </div>

      <p className="text-xs text-center mt-4" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
        💡 يمكنك الضغط على مفتاح المسافة للتسبيح
      </p>
    </div>
  );
}