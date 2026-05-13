import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ─── Constants ───────────────────────────────────────────
const VERSES_PER_PAGE = 10;

// ─── Helpers ─────────────────────────────────────────────
const fetchWithTimeout = (url, timeout = 12000) =>
  new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('timeout')), timeout);
    fetch(url).then(r => { clearTimeout(t); res(r); }).catch(e => { clearTimeout(t); rej(e); });
  });

const fetchWithRetry = async (url, retries = 2) => {
  try { return await fetchWithTimeout(url); }
  catch (e) { if (retries > 0) return fetchWithRetry(url, retries - 1); throw e; }
};

const toArabic = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

const getHijriDate = () => {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date());
  } catch { return ''; }
};

// ─── Ayah Marker ─────────────────────────────────────────
const AyahMarker = ({ num }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '2em', height: '2em', margin: '0 3px',
    verticalAlign: 'middle', flexShrink: 0, position: 'relative',
  }}>
    <svg viewBox="0 0 40 40" width="30" height="30" style={{ position: 'absolute' }}>
      {[0, 45, 90, 135].map(a => (
        <ellipse key={a} cx="20" cy="20" rx="18" ry="8"
          fill="none" stroke="var(--color-gold)" strokeWidth="1.2"
          transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="11" fill="var(--color-gold)" />
    </svg>
    <span style={{
      position: 'relative', zIndex: 1,
      fontSize: '11px', color: 'var(--color-bg)',
      fontFamily: "'Amiri', serif", fontWeight: 'bold',
    }}>
      {toArabic(num)}
    </span>
  </span>
);

// ─── Surah Banner ─────────────────────────────────────────
const SurahBanner = ({ name }) => (
  <div style={{
    position: 'relative', textAlign: 'center',
    margin: '4px 0 10px', padding: '10px 20px',
    border: '1.5px solid var(--color-gold)', borderRadius: '6px',
    background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 50%, var(--color-surface) 100%)',
  }}>
    <div style={{
      position: 'absolute', inset: '4px',
      border: '1px solid var(--color-border)',
      borderRadius: '4px', pointerEvents: 'none',
    }} />
    {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
      <div key={v+h} style={{
        position: 'absolute', [v]: '-5px', [h]: '-5px',
        width: '9px', height: '9px',
        background: 'var(--color-gold)', transform: 'rotate(45deg)',
      }} />
    ))}
    <span style={{
      fontFamily: "'Amiri', serif", fontSize: '20px',
      fontWeight: 'bold', color: 'var(--color-gold)', letterSpacing: '2px',
    }}>
      ﴾ سُورَةُ {name.replace('سورة ', '')} ﴿
    </span>
  </div>
);

// ─── Basmala ──────────────────────────────────────────────
const Basmala = () => (
  <div style={{
    textAlign: 'center', fontFamily: "'Amiri', serif",
    fontSize: '24px', margin: '4px 0 12px',
    color: 'var(--color-gold)', lineHeight: 1.8,
  }}>
    بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
  </div>
);

// ─── Page Dots ────────────────────────────────────────────
const PageDots = ({ total, current }) => {
  const show = Math.min(total, 7);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
      {Array.from({ length: show }).map((_, i) => {
        const active = i === Math.min(current, show - 1) || (i === show - 1 && current >= show - 1);
        return (
          <div key={i} style={{
            width: active ? '16px' : '5px', height: '5px',
            borderRadius: '3px', transition: 'all 0.3s',
            background: active ? 'var(--color-gold)' : 'var(--color-border)',
          }} />
        );
      })}
    </div>
  );
};

// ─── Divider ──────────────────────────────────────────────
const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
    <span style={{ color: 'var(--color-gold)', fontSize: '13px' }}>✦</span>
    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
  </div>
);

// ─── Spinner ──────────────────────────────────────────────
const Spinner = () => (
  <>
    <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{
        width: 38, height: 38,
        border: '3px solid var(--color-gold)',
        borderTopColor: 'transparent', borderRadius: '50%',
        animation: '_spin 0.8s linear infinite',
      }} />
    </div>
  </>
);

// ════════════════════════════════════════════════════════════
export default function QuranPage() {
  const { t, i18n } = useTranslation();

  const [surahs, setSurahs]             = useState([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [selected, setSelected]         = useState(null);
  const [allVerses, setAllVerses]       = useState([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [search, setSearch]             = useState('');
  const [currentPage, setCurrentPage]   = useState(0);
  const [direction, setDirection]       = useState(1);

  const touchStartX = useRef(null);
  const hijriDate   = getHijriDate();

  const totalPages  = Math.ceil(allVerses.length / VERSES_PER_PAGE);
  const pageVerses  = allVerses.slice(
    currentPage * VERSES_PER_PAGE,
    (currentPage + 1) * VERSES_PER_PAGE,
  );
  const isFirstPage = currentPage === 0;
  const isLastPage  = currentPage >= totalPages - 1;

  const goNext = useCallback(() => {
    if (!isLastPage) { setDirection(1); setCurrentPage(p => p + 1); }
  }, [isLastPage]);

  const goPrev = useCallback(() => {
    if (!isFirstPage) { setDirection(-1); setCurrentPage(p => p - 1); }
  }, [isFirstPage]);

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  // Load list
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetchWithRetry('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahs(data.data.map(s => ({
          number: s.number, name: s.name,
          englishName: s.englishName, verses: s.numberOfAyahs,
          revelation: s.revelationType === 'Meccan' ? 'مكية' : 'مدنية',
        })));
      } catch { setSurahs([]); }
      finally  { setLoadingSurahs(false); }
    })();
  }, []);

  const filtered = surahs.filter(s =>
    s.name.includes(search) ||
    s.englishName.toLowerCase().includes(search.toLowerCase())
  );

  const loadSurah = async (surah) => {
    setSelected(surah);
    setCurrentPage(0);
    setLoadingVerses(true);
    setAllVerses([]);
    try {
      const res  = await fetchWithRetry(
        `https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`
      );
      const data = await res.json();
      setAllVerses(data?.data?.ayahs || []);
    } catch { setAllVerses([]); }
    finally { setLoadingVerses(false); }
  };

  const goBack = () => { setSelected(null); setAllVerses([]); setCurrentPage(0); };

  const showBasmala = selected && selected.number !== 9 && isFirstPage;

  // Page flip variants
  const variants = {
    enter:  d => ({ x: d > 0 ? '70%' : '-70%', opacity: 0, rotateY: d > 0 ? 12 : -12 }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit:   d => ({ x: d > 0 ? '-70%' : '70%', opacity: 0, rotateY: d > 0 ? -12 : 12 }),
  };

  // ════════════════════════════════════════════════════════
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      color: 'var(--color-text)', direction: 'rtl', position: 'relative',
    }}>
      {/* Background pattern */}
      <div className="pattern-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">

          {/* ══════ LIST ══════ */}
          {!selected ? (
            <motion.div key="list"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}
              style={{ padding: '16px' }}
            >
              {/* Title */}
              <div style={{
                textAlign: 'center', marginBottom: '18px',
                paddingBottom: '14px', borderBottom: '1px solid var(--color-border)',
              }}>
                <div className="gold-shimmer" style={{
                  fontFamily: "'Amiri', serif", fontSize: '28px', fontWeight: 'bold',
                }}>
                  القرآن الكريم
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  📅 {hijriDate}
                </div>
              </div>

              {/* Search */}
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('search') || 'ابحث عن سورة...'}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)', color: 'var(--color-text)',
                  fontFamily: "'Amiri', serif", fontSize: '16px',
                  outline: 'none', boxSizing: 'border-box', marginBottom: '14px',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
              />

              {loadingSurahs ? <Spinner /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filtered.map((surah, idx) => (
                    <motion.button key={surah.number}
                      onClick={() => loadSurah(surah)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.018, 0.28) }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 14px', borderRadius: '14px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        cursor: 'pointer', width: '100%',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--color-gold)';
                        e.currentTarget.style.background  = 'var(--color-surface-2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.background  = 'var(--color-surface)';
                      }}
                    >
                      {/* Diamond number */}
                      <div style={{
                        width: 40, height: 40, flexShrink: 0,
                        background: 'var(--color-emerald)',
                        border: '1px solid var(--color-gold)',
                        transform: 'rotate(45deg)', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{
                          transform: 'rotate(-45deg)', color: 'var(--color-gold-light)',
                          fontSize: '13px', fontFamily: "'Amiri', serif", fontWeight: 'bold',
                        }}>
                          {toArabic(surah.number)}
                        </span>
                      </div>

                      {/* Name */}
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <div style={{
                          fontFamily: "'Amiri', serif", fontSize: '20px',
                          color: 'var(--color-text)', fontWeight: 'bold',
                        }}>
                          {surah.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-gold)', marginTop: 2 }}>
                          {surah.revelation} · {toArabic(surah.verses)} آية
                        </div>
                      </div>

                      <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>❮</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

          ) : (

            /* ══════ MUSHAF ══════ */
            <motion.div key="mushaf"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
            >

              {/* Top bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', flexShrink: 0,
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <button onClick={goBack} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-gold)', fontSize: '20px', padding: '4px 8px',
                }}>❯</button>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: "'Amiri', serif" }}>
                  📅 {hijriDate}
                </div>
              </div>

              {/* Info bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 16px', flexShrink: 0,
                background: 'var(--color-surface-2)',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <div style={{ textAlign: 'right', fontFamily: "'Amiri', serif", fontSize: '13px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>السورة</div>
                  <div style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                    {selected.name.replace('سورة ', '')}
                  </div>
                </div>

                <div style={{
                  padding: '4px 18px', borderRadius: '20px',
                  border: '1px solid var(--color-gold)',
                  fontFamily: "'Amiri', serif", fontSize: '14px',
                  color: 'var(--color-gold)',
                }}>
                  {toArabic(currentPage + 1)} / {toArabic(Math.max(totalPages, 1))}
                </div>

                <div style={{ textAlign: 'left', fontFamily: "'Amiri', serif", fontSize: '13px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>الآيات</div>
                  <div style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                    {toArabic(selected.verses)}
                  </div>
                </div>
              </div>

              {/* Page area */}
              <div style={{ flex: 1, overflow: 'hidden', position: 'relative', perspective: '1200px' }}
                onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
              >
                {loadingVerses ? <Spinner /> : (
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={currentPage}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                      style={{
                        position: 'absolute', inset: 0,
                        padding: '12px 14px 16px',
                        overflowY: 'auto',
                        transformOrigin: direction > 0 ? 'left center' : 'right center',
                      }}
                    >
                      {/* Paper card */}
                      <div style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '14px', padding: '16px',
                        boxShadow: '0 6px 30px rgba(0,0,0,0.35)',
                        minHeight: 'calc(100% - 4px)',
                      }}>
                        {isFirstPage && (
                          <>
                            <SurahBanner name={selected.name} />
                            {showBasmala && <Basmala />}
                            <Divider />
                          </>
                        )}

                        <p style={{
                          fontFamily: "'Amiri','Scheherazade New',serif",
                          fontSize: '26px', lineHeight: '2.5',
                          color: 'var(--color-text)',
                          textAlign: 'justify', margin: 0, direction: 'rtl',
                        }}>
                          {pageVerses.map(ayah => (
                            <React.Fragment key={ayah.numberInSurah}>
                              <span>{ayah.text}</span>
                              {' '}<AyahMarker num={ayah.numberInSurah} />{' '}
                            </React.Fragment>
                          ))}
                        </p>

                        {/* Bottom page num */}
                        <div style={{
                          textAlign: 'center', marginTop: '18px', paddingTop: '10px',
                          borderTop: '1px solid var(--color-border)',
                          fontSize: '13px', color: 'var(--color-text-muted)',
                          fontFamily: "'Amiri', serif",
                        }}>
                          ─ {toArabic(currentPage + 1)} ─
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Navigation */}
              {!loadingVerses && totalPages > 1 && (
                <div style={{
                  flexShrink: 0, padding: '10px 20px',
                  background: 'var(--color-surface)',
                  borderTop: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    <motion.button onClick={goPrev} disabled={isFirstPage}
                      whileTap={!isFirstPage ? { scale: 0.88 } : {}}
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        border: `1.5px solid ${isFirstPage ? 'var(--color-border)' : 'var(--color-gold)'}`,
                        background: isFirstPage ? 'transparent' : 'var(--color-emerald)',
                        color: isFirstPage ? 'var(--color-border)' : 'var(--color-gold-light)',
                        fontSize: '18px', cursor: isFirstPage ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >❯</motion.button>

                    <PageDots total={totalPages} current={currentPage} />

                    <motion.button onClick={goNext} disabled={isLastPage}
                      whileTap={!isLastPage ? { scale: 0.88 } : {}}
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        border: `1.5px solid ${isLastPage ? 'var(--color-border)' : 'var(--color-gold)'}`,
                        background: isLastPage ? 'transparent' : 'var(--color-emerald)',
                        color: isLastPage ? 'var(--color-border)' : 'var(--color-gold-light)',
                        fontSize: '18px', cursor: isLastPage ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >❮</motion.button>

                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}