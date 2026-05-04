import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ⏱️ Fetch with Timeout + Retry
const fetchWithTimeout = (url, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);

    fetch(url)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

const fetchWithRetry = async (url, retries = 2) => {
  try {
    const res = await fetchWithTimeout(url, 12000);
    return res;
  } catch (err) {
    if (retries > 0) {
      return fetchWithRetry(url, retries - 1);
    }
    throw err;
  }
};

export default function QuranPage() {
  const { t, i18n } = useTranslation();

  const [surahs, setSurahs] = useState([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);

  const [selected, setSelected] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  const [search, setSearch] = useState('');

  const isAr = i18n.language === 'ar';

  // 📥 تحميل السور
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetchWithRetry('https://api.alquran.cloud/v1/surah');
        const data = await res.json();

        const formatted = data.data.map((s) => ({
          number: s.number,
          name: s.name,
          englishName: s.englishName,
          verses: s.numberOfAyahs,
          revelation: s.revelationType === 'Meccan' ? 'مكية' : 'مدنية',
        }));

        setSurahs(formatted);
      } catch (err) {
        console.error('Surahs error:', err);
        setSurahs([]);
      } finally {
        setLoadingSurahs(false);
      }
    };

    fetchSurahs();
  }, []);

  // 🔍 فلترة
  const filtered = surahs.filter(
    (s) =>
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(search.toLowerCase())
  );

  // 📖 تحميل سورة
  const loadSurah = async (surah) => {
    setSelected(surah);
    setLoadingVerses(true);
    setVerses([]);

    try {
      const res = await fetchWithRetry(
        `https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`
      );

      const data = await res.json();
      setVerses(data?.data?.ayahs || []);
    } catch (err) {
      console.error('Surah error:', err);
      setVerses([]);
    } finally {
      setLoadingVerses(false);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-gold)' }}>
          📖 {t('quran')}
        </h1>

        {selected && (
          <button
            onClick={() => {
              setSelected(null);
              setVerses([]);
            }}
            className="text-sm px-3 py-1.5 rounded-lg"
          >
            ← {isAr ? 'رجوع' : 'Back'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* ================= LIST ================= */}
        {!selected ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            {/* 🔍 Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search')}
              className="
                w-full px-4 py-3 mb-4 rounded-2xl
                bg-[var(--bg-card)]/80 backdrop-blur-md
                border border-white/10
                text-[var(--text-primary)]
                placeholder:opacity-40
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
                transition-all duration-300
              "
            />

            {loadingSurahs ? (
              <div className="flex justify-center py-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-8 h-8 border-2 rounded-full"
                />
              </div>
            ) : (

              <div className="space-y-3">
                {filtered.map((surah) => (
                  <motion.button
                    key={surah.number}
                    onClick={() => loadSurah(surah)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border"
                  >

                    <div className="text-sm opacity-70">
                      {surah.verses} {isAr ? 'آيات' : 'verses'}
                    </div>

                    {/* 📖 الاسم + البسملة */}
                    <div className="flex-1 text-right px-4">
                      
                      <div
                        className="text-xl font-bold"
                        style={{ fontFamily: "'Amiri', serif" }}
                      >
                        {surah.name}
                      </div>

                      <div
                        className="text-sm mt-1"
                        style={{
                          fontFamily: "'Amiri', serif",
                          color: 'var(--color-gold)'
                        }}
                      >
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>

                      <div className="text-xs opacity-60 mt-1">
                        {surah.revelation}
                      </div>

                    </div>

                    <div
                      className="w-12 h-12 flex items-center justify-center"
                      style={{
                        transform: 'rotate(45deg)',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px'
                      }}
                    >
                      <span style={{ transform: 'rotate(-45deg)' }}>
                        {surah.number}
                      </span>
                    </div>

                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (

          /* ================= VERSES ================= */
          <motion.div
            key="verses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >

            {loadingVerses ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 rounded-full animate-spin" />
              </div>
            ) : (

              <div className="p-4 rounded-xl">

                {/* 📖 الآيات في النص */}
                <p
                  className="text-center leading-loose"
                  style={{
                    fontSize: '26px',
                    lineHeight: '2.2',
                    fontFamily: "'Amiri', 'Scheherazade', serif"
                  }}
                >
                  {verses.map((ayah) => (
                    <span key={ayah.numberInSurah}>
                      {ayah.text}{' '}
                      <span style={{ color: 'gold', fontSize: '18px' }}>
                        ﴿{ayah.numberInSurah}﴾
                      </span>{' '}
                    </span>
                  ))}
                </p>

              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}