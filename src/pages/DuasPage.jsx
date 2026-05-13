import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { duaCategories } from '../data/duas';

const categoryIcons = {
  morning_evening: 'ti-sun',
  food_drink:      'ti-tools-kitchen-2',
  sleep_wake:      'ti-moon',
  travel:          'ti-plane',
  distress:        'ti-hand-stop',
  mosque:          'ti-building-mosque',
  rain_weather:    'ti-cloud-rain',
  forgiveness:     'ti-refresh',
  prayer_related:  'ti-droplet',
  comprehensive:   'ti-diamond',
  family_home:     'ti-home',
  health_sick:     'ti-heart-plus',
  knowledge_work:  'ti-book',
  social_manners:  'ti-handshake',
  default:         'ti-sparkles',
};

function getCatIcon(catId) {
  return categoryIcons[catId] || categoryIcons.default;
}

export default function DuasPage() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(null);
  const isAr = i18n.language === 'ar';

  return (
    <>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
    <div className="pattern-overlay" style={{ zIndex: 0 }} />
    
    <div className="px-4 py-4 space-y-5" style={{ position: 'relative', zIndex: 1 }}></div>
      <style>{`
      

        @keyframes duasPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.18); }
        }
        @keyframes duasSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes duasFadeScale {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes duasSpinOnce {
          from { transform: rotate(-20deg) scale(0.8); }
          to   { transform: rotate(0deg)  scale(1); }
        }
        @keyframes duasFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .duas-header-anim    { animation: duasSlideDown 0.4s ease both; }
        .duas-header-icon    { animation: duasPulse 2s infinite; display: inline-block; }

        .duas-cat-btn {
          transition: transform 0.15s, border-color 0.2s;
          animation: duasFadeScale 0.4s ease both;
        }
        .duas-cat-btn:nth-child(1) { animation-delay: 0.05s; }
        .duas-cat-btn:nth-child(2) { animation-delay: 0.10s; }
        .duas-cat-btn:nth-child(3) { animation-delay: 0.15s; }
        .duas-cat-btn:nth-child(4) { animation-delay: 0.20s; }
        .duas-cat-btn:nth-child(5) { animation-delay: 0.25s; }
        .duas-cat-btn:nth-child(6) { animation-delay: 0.30s; }
        .duas-cat-btn:active       { transform: scale(0.95); }
        .duas-cat-btn:hover .duas-cat-icon-wrap {
          transform: rotate(-8deg) scale(1.15);
        }

        .duas-cat-icon-wrap {
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
        }

        .duas-detail-icon { animation: duasSpinOnce 0.5s ease both; display: inline-block; }

        .duas-dua-card { animation: duasFadeUp 0.35s ease both; }
        .duas-dua-card:nth-child(1) { animation-delay: 0.04s; }
        .duas-dua-card:nth-child(2) { animation-delay: 0.10s; }
        .duas-dua-card:nth-child(3) { animation-delay: 0.16s; }
        .duas-dua-card:nth-child(4) { animation-delay: 0.22s; }
        .duas-dua-card:nth-child(5) { animation-delay: 0.28s; }
      `}</style>

      <div className="px-4 py-4 space-y-4">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="duas-header-anim"
        >
          <h1
            className="text-xl font-bold arabic-text flex items-center gap-2"
            style={{ color: 'var(--color-gold)' }}
          >
            <i
              className="ti ti-hand-stop duas-header-icon"
              style={{ fontSize: '1.4rem' }}
              aria-hidden="true"
            />
            الأدعية المأثورة
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            أدعية من القرآن الكريم والسنة النبوية الشريفة
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── Categories grid ── */}
          {!selected ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              {duaCategories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelected(cat)}
                  className="duas-cat-btn flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className="duas-cat-icon-wrap flex items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      background: 'rgba(212,175,55,0.12)',
                    }}
                  >
                    <i
                      className={`ti ${getCatIcon(cat.id)}`}
                      style={{ fontSize: '1.5rem', color: 'var(--color-gold)' }}
                      aria-hidden="true"
                    />
                  </div>

                  <span
                    className="text-xs font-semibold arabic-text leading-tight"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {cat.title}
                  </span>

                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(212,175,55,0.1)',
                      color: 'var(--color-gold)',
                    }}
                  >
                    {cat.duas.length} دعاء
                  </span>
                </motion.button>
              ))}
            </motion.div>

          ) : (

            /* ── Dua detail ── */
            <motion.div
              key="duas-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Detail header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <i
                    className={`ti ${getCatIcon(selected.id)} duas-detail-icon`}
                    style={{ fontSize: '1.4rem', color: 'var(--color-gold)' }}
                    aria-hidden="true"
                  />
                  <h2
                    className="font-bold arabic-text"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {selected.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="text-sm px-3 py-1.5 rounded-lg flex items-center gap-1"
                  style={{
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                  رجوع
                </button>
              </div>

              {/* Dua cards */}
              <div className="space-y-4">
                {selected.duas.map((dua, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="duas-dua-card rounded-2xl p-5 relative overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {/* Opening quote icon */}
                    <div
                      className="text-center mb-3"
                      style={{ color: 'rgba(212,175,55,0.4)' }}
                    >
                      <i
                        className="ti ti-quote"
                        style={{ fontSize: '1.2rem' }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Note badge */}
                    {dua.note && (
                      <div className="mb-3 text-center">
                        <span
                          className="text-xs px-3 py-1 rounded-full inline-flex items-center gap-1"
                          style={{
                            background: 'rgba(212,175,55,0.1)',
                            color: 'var(--color-gold)',
                          }}
                        >
                          <i className="ti ti-pin" style={{ fontSize: '0.85rem' }} aria-hidden="true" />
                          {dua.note}
                        </span>
                      </div>
                    )}

                    {/* Arabic text */}
                    <p
                      className="arabic-text text-lg leading-loose text-center mb-4"
                      style={{
                        color: 'var(--color-text)',
                        fontSize: '1.2rem',
                        lineHeight: 2.2,
                      }}
                    >
                      {dua.arabic}
                    </p>

                    {/* Translation */}
                    {!isAr && dua.translation && (
                      <p
                        className="text-sm italic text-center mb-4"
                        style={{
                          color: 'var(--color-text-muted)',
                          lineHeight: 1.7,
                        }}
                      >
                        "{dua.translation}"
                      </p>
                    )}

                    {/* Closing quote icon */}
                    <div
                      className="text-center mb-2"
                      style={{
                        color: 'rgba(212,175,55,0.4)',
                        transform: 'scaleX(-1)',
                      }}
                    >
                      <i
                        className="ti ti-quote"
                        style={{ fontSize: '1.2rem' }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Source */}
                    <div
                      className="flex items-center justify-center mt-3 pt-3"
                      style={{ borderTop: '1px solid var(--color-border)' }}
                    >
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium inline-flex items-center gap-1"
                        style={{
                          background: 'rgba(45,106,79,0.15)',
                          color: '#4ade80',
                        }}
                      >
                        <i className="ti ti-books" style={{ fontSize: '0.85rem' }} aria-hidden="true" />
                        {dua.source}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </>
  );
}