import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { duaCategories } from '../data/duas';

export default function DuasPage() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(null);
  const isAr = i18n.language === 'ar';

  return (
    <div className="px-4 py-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          🤲 الأدعية المأثورة
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          أدعية من القرآن الكريم والسنة النبوية الشريفة
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3">
            {duaCategories.map((cat, i) => (
              <motion.button key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(cat)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold arabic-text leading-tight"
                  style={{ color: 'var(--color-text)' }}>
                  {cat.title}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)' }}>
                  {cat.duas.length} دعاء
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="duas-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selected.icon}</span>
                <h2 className="font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
                  {selected.title}
                </h2>
              </div>
              <button onClick={() => setSelected(null)}
                className="text-sm px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                ← رجوع
              </button>
            </div>

            {/* Duas */}
            <div className="space-y-4">
              {selected.duas.map((dua, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Decorative top */}
                  <div className="text-center mb-3" style={{ color: 'rgba(212,175,55,0.4)', fontSize: '1.2rem' }}>❝</div>

                  {/* Note badge */}
                  {dua.note && (
                    <div className="mb-3 text-center">
                      <span className="text-xs px-3 py-1 rounded-full"
                        style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)' }}>
                        📌 {dua.note}
                      </span>
                    </div>
                  )}

                  {/* Arabic text */}
                  <p className="arabic-text text-lg leading-loose text-center mb-4"
                    style={{ color: 'var(--color-text)', fontSize: '1.2rem', lineHeight: 2.2 }}>
                    {dua.arabic}
                  </p>

                  {/* Translation */}
                  {!isAr && dua.translation && (
                    <p className="text-sm italic text-center mb-4"
                      style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                      "{dua.translation}"
                    </p>
                  )}

                  <div className="text-center mb-2" style={{ color: 'rgba(212,175,55,0.4)', fontSize: '1.2rem' }}>❞</div>

                  {/* Source */}
                  <div className="flex items-center justify-center mt-3 pt-3"
                    style={{ borderTop: '1px solid var(--color-border)' }}>
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(45,106,79,0.15)', color: '#4ade80' }}>
                      📚 {dua.source}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
