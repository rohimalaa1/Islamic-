import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { hadiths, getDailyHadith } from '../data/hadith';

export default function HadithPage() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('daily');
  const daily = getDailyHadith();
  const isAr = i18n.language === 'ar';

  return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
    <div className="pattern-overlay" style={{ zIndex: 0 }} />
    
    <div className="px-4 py-4 space-y-5" style={{ position: 'relative', zIndex: 1 }}></div>
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
        📜 {t('hadith')}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--color-surface)' }}>
        {['daily', 'collection'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all relative">
            {activeTab === tab && (
              <motion.div layoutId="hadith-tab" className="absolute inset-0 rounded-lg"
                style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10" style={{ color: activeTab === tab ? 'var(--color-gold)' : 'var(--color-text-muted)' }}>
              {tab === 'daily' ? t('daily_hadith') : t('hadith_collection')}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'daily' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 0 40px rgba(212,175,55,0.08)',
          }}>
          <div className="text-center mb-6">
            <span className="text-4xl">📿</span>
            <h2 className="text-lg font-bold mt-2" style={{ color: 'var(--color-gold)' }}>{t('daily_hadith')}</h2>
          </div>
          <div className="text-center mb-1" style={{ color: 'rgba(212,175,55,0.6)', fontSize: '1.5rem' }}>❝</div>
          <p className="arabic-text text-xl leading-loose text-center mb-4" style={{ color: 'var(--color-text)' }}>
            {daily.arabic}
          </p>
          {!isAr && (
            <p className="text-sm italic text-center mb-4" style={{ color: 'var(--color-text-muted)' }}>
              "{daily.translation}"
            </p>
          )}
          <div className="text-center" style={{ color: 'rgba(212,175,55,0.6)', fontSize: '1.5rem' }}>❞</div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--color-text-muted)' }}>
                {isAr ? daily.narrator : daily.narratorEn}
              </span>
              <span className="px-3 py-1 rounded-full text-xs"
                style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)' }}>
                {isAr ? daily.source : daily.sourceEn} #{daily.number}
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {hadiths.map((hadith, i) => (
            <motion.div key={hadith.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <p className="arabic-text text-base leading-loose mb-3" style={{ color: 'var(--color-text)' }}>
                {hadith.arabic}
              </p>
              {!isAr && (
                <p className="text-sm italic mb-3" style={{ color: 'var(--color-text-muted)' }}>
                  {hadith.translation}
                </p>
              )}
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {isAr ? hadith.narrator : hadith.narratorEn}
                </span>
                <span className="px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)' }}>
                  {isAr ? hadith.source : hadith.sourceEn}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
