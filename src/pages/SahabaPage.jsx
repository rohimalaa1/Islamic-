import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sahaba, sahabaCategories } from '../data/sahaba';

const CategoryBadge = ({ cat }) => (
  <span className="text-xs px-2 py-0.5 rounded-full"
    style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212,175,55,0.2)' }}>
    {cat}
  </span>
);

export default function SahabaPage() {
  const [selected, setSelected]     = useState(null);
  const [activeStory, setActiveStory] = useState(0);
  const [activeTab, setActiveTab]   = useState('all');

  const filtered = activeTab === 'all'
    ? sahaba
    : sahaba.filter(s => s.category === activeTab);

  const openSahabi = (s) => { setSelected(s); setActiveStory(0); };

  return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
    <div className="pattern-overlay" style={{ zIndex: 0 }} />
    
    <div className="px-4 py-4 space-y-5" style={{ position: 'relative', zIndex: 1 }}></div>
    <div className="px-4 py-4 space-y-4">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          🌟 قصص الصحابة
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {sahaba.length} صحابي من خير القرون
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button onClick={() => setActiveTab('all')}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeTab === 'all' ? 'var(--color-gold)' : 'var(--color-surface)',
                  color: activeTab === 'all' ? '#0d2318' : 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}>
                الكل
              </button>
              {sahabaCategories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: activeTab === cat ? 'var(--color-gold)' : 'var(--color-surface)',
                    color: activeTab === cat ? '#0d2318' : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Cards grid */}
            <div className="space-y-3">
              {filtered.map((s, i) => (
                <motion.button key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openSahabi(s)}
                  className="w-full text-right rounded-2xl p-4 transition-all"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>

                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      {s.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-right">
                      <h3 className="font-bold arabic-text text-base" style={{ color: 'var(--color-text)' }}>
                        {s.name}
                      </h3>
                      <p className="text-xs mt-0.5 arabic-text" style={{ color: 'var(--color-gold)' }}>
                        {s.title}
                      </p>
                      <div className="mt-1.5">
                        <CategoryBadge cat={s.category} />
                      </div>
                    </div>

                    {/* Stories count */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ background: 'rgba(45,106,79,0.15)', color: '#4ade80' }}>
                        {s.stories.length}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>قصة</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

        ) : (
          /* ── Detail ── */
          <motion.div key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4">

            {/* Back */}
            <button onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
              ← العودة للقائمة
            </button>

            {/* Profile card */}
            <div className="rounded-2xl p-5 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface-2))',
                border: '1px solid var(--color-border)',
                boxShadow: '0 0 40px rgba(212,175,55,0.08)',
              }}>
              <div className="absolute inset-0 opacity-5 pattern-overlay" />
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}>
                {selected.icon}
              </div>
              <h2 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
                {selected.name}
              </h2>
              <p className="text-sm mt-1 arabic-text" style={{ color: 'var(--color-text-muted)' }}>
                {selected.title}
              </p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>📅 {selected.born} — {selected.died}</span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <p className="arabic-text text-sm leading-loose" style={{ color: 'var(--color-text)', lineHeight: 2 }}>
                {selected.description}
              </p>
            </div>

            {/* Stories tabs */}
            <div>
              <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--color-gold)' }}>
                📖 القصص والمواقف
              </h3>
              {/* Story selector */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {selected.stories.map((story, i) => (
                  <button key={i} onClick={() => setActiveStory(i)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: activeStory === i ? 'rgba(212,175,55,0.2)' : 'var(--color-surface)',
                      color: activeStory === i ? 'var(--color-gold)' : 'var(--color-text-muted)',
                      border: activeStory === i ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--color-border)',
                    }}>
                    {i + 1}. {story.title.slice(0, 15)}...
                  </button>
                ))}
              </div>

              {/* Story content */}
              <AnimatePresence mode="wait">
                <motion.div key={activeStory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl p-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(45,106,79,0.08), rgba(45,106,79,0.03))',
                    border: '1px solid rgba(45,106,79,0.2)',
                  }}>
                  <h4 className="font-bold arabic-text mb-3" style={{ color: '#4ade80' }}>
                    ✨ {selected.stories[activeStory].title}
                  </h4>
                  <p className="arabic-text text-sm leading-loose" style={{ color: 'var(--color-text)', lineHeight: 2.1 }}>
                    {selected.stories[activeStory].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Virtues */}
            <div className="rounded-2xl p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--color-gold)' }}>⭐ أبرز فضائله</h3>
              <div className="space-y-2">
                {selected.virtues.map((v, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: 'var(--color-gold)' }}>✦</span>
                    <p className="arabic-text text-sm" style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="rounded-2xl p-5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))',
                border: '1px solid rgba(212,175,55,0.2)',
              }}>
              <p className="text-2xl mb-2" style={{ color: 'rgba(212,175,55,0.4)' }}>❝</p>
              <p className="arabic-text text-sm italic leading-loose" style={{ color: 'var(--color-text)', lineHeight: 2 }}>
                {selected.quote}
              </p>
              <p className="text-2xl mt-2" style={{ color: 'rgba(212,175,55,0.4)' }}>❞</p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>— {selected.name}</p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
