import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ══════════════════════════════
   التشهدين
══════════════════════════════ */
const tashahudat = [
  {
    id: 1,
    title: "التشهد الأول",
    subtitle: "يُقال في الجلسة الوسطى",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu alayna wa ala ibadillahis-salihin, ashhadu an la ilaha illallah wa ashhadu anna Muhammadan abduhu wa rasuluh",
    translation: "All greetings, prayers and good words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.",
    source: "صحيح البخاري",
    note: "يجلس للتشهد الأول في كل صلاة رباعية وثلاثية بعد الركعة الثانية",
    steps: [
      "الجلوس على القدم اليسرى ونصب اليمنى",
      "وضع اليدين على الفخذين",
      "الإشارة بالسبابة عند الشهادتين",
      "قراءة التشهد بتأنٍّ وخشوع",
    ]
  },
  {
    id: 2,
    title: "التشهد الأخير",
    subtitle: "يُقال في الجلسة الأخيرة مع الصلاة الإبراهيمية",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    arabic2: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    arabic2Title: "الصلاة الإبراهيمية",
    transliteration: "At-tahiyyatu lillahi... (same as above) then: Allahumma salli ala Muhammad wa ala ali Muhammad, kama sallayta ala Ibrahim wa ala ali Ibrahim, innaka Hamidun Majid...",
    translation: "Same as the first Tashahud, followed by: O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed You are the Praiseworthy, the Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim. Indeed You are the Praiseworthy, the Glorious.",
    source: "صحيح البخاري ومسلم",
    note: "التشهد الأخير ركن من أركان الصلاة ويُختم بالسلام",
    dua: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    duaTitle: "دعاء قبل السلام (مستحب)",
    steps: [
      "الجلوس المتورك (اليسرى تحت اليمنى)",
      "قراءة التشهد كاملاً",
      "قراءة الصلاة الإبراهيمية",
      "الدعاء قبل السلام",
      "التسليم يميناً ثم يساراً",
    ]
  },
];

/* ══════════════════════════════
   القبلة
══════════════════════════════ */
function QiblaCompass({ heading, qiblaAngle, hasPermission, error }) {
  const needleAngle = qiblaAngle - heading;
  const isAligned = Math.abs(((needleAngle % 360) + 360) % 360 - 0) < 10 ||
                    Math.abs(((needleAngle % 360) + 360) % 360 - 360) < 10;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Compass */}
      <div className="relative" style={{ width: 220, height: 220 }}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--color-surface)',
            border: `3px solid ${isAligned ? 'rgba(45,106,79,0.6)' : 'var(--color-border)'}`,
            boxShadow: isAligned ? '0 0 30px rgba(45,106,79,0.3)' : '0 0 20px rgba(212,175,55,0.1)',
            transition: 'all 0.4s ease',
          }} />

        {/* Cardinal directions */}
        {[
          { label: 'N', angle: 0,   style: { top: 8,    left: '50%', transform: 'translateX(-50%)' } },
          { label: 'S', angle: 180, style: { bottom: 8, left: '50%', transform: 'translateX(-50%)' } },
          { label: 'E', angle: 90,  style: { right: 8,  top: '50%',  transform: 'translateY(-50%)' } },
          { label: 'W', angle: 270, style: { left: 8,   top: '50%',  transform: 'translateY(-50%)' } },
        ].map(d => (
          <span key={d.label} className="absolute text-xs font-bold"
            style={{ ...d.style, color: d.label === 'N' ? '#f87171' : 'var(--color-text-muted)' }}>
            {d.label}
          </span>
        ))}

        {/* Degree marks */}
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="absolute"
            style={{
              width: 2, height: i % 9 === 0 ? 12 : 6,
              background: i % 9 === 0 ? 'var(--color-gold)' : 'rgba(212,175,55,0.3)',
              left: '50%', top: 4,
              transformOrigin: '50% 102px',
              transform: `translateX(-50%) rotate(${i * 10}deg)`,
              borderRadius: 2,
            }} />
        ))}

        {/* Kaaba icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: needleAngle }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            style={{ width: '100%', height: '100%', position: 'absolute' }}>
            {/* Qibla needle */}
            <div className="absolute" style={{
              width: 4, height: 80,
              background: 'linear-gradient(to top, rgba(45,106,79,0.3), #4ade80)',
              left: '50%', top: '10%',
              transform: 'translateX(-50%)',
              borderRadius: '2px 2px 0 0',
              boxShadow: '0 0 8px rgba(74,222,128,0.5)',
            }} />
            <div className="absolute" style={{
              width: 4, height: 40,
              background: 'rgba(239,68,68,0.5)',
              left: '50%', bottom: '10%',
              transform: 'translateX(-50%)',
              borderRadius: '0 0 2px 2px',
            }} />
          </motion.div>

          {/* Center dot with Kaaba */}
          <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{
              background: isAligned ? 'rgba(45,106,79,0.3)' : 'var(--color-surface-2)',
              border: `2px solid ${isAligned ? 'rgba(45,106,79,0.6)' : 'var(--color-border)'}`,
              transition: 'all 0.4s ease',
            }}>
            🕋
          </div>
        </div>
      </div>

      {/* Status */}
      {error ? (
        <div className="text-center px-4 py-3 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      ) : !hasPermission ? (
        <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-sm">جارٍ طلب الإذن للبوصلة...</p>
        </div>
      ) : (
        <motion.div animate={{ scale: isAligned ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: isAligned ? Infinity : 0, duration: 1.5 }}
          className="text-center px-6 py-3 rounded-2xl"
          style={{
            background: isAligned ? 'rgba(45,106,79,0.2)' : 'rgba(212,175,55,0.08)',
            border: `1px solid ${isAligned ? 'rgba(45,106,79,0.4)' : 'rgba(212,175,55,0.2)'}`,
          }}>
          <p className="text-2xl mb-1">{isAligned ? '✅' : '🧭'}</p>
          <p className="font-bold text-sm arabic-text"
            style={{ color: isAligned ? '#4ade80' : 'var(--color-gold)' }}>
            {isAligned ? 'أنت تواجه القبلة!' : 'اتجه نحو القبلة'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            زاوية القبلة: {Math.round(((qiblaAngle % 360) + 360) % 360)}°
          </p>
        </motion.div>
      )}
    </div>
  );
}

function useQibla() {
  const [heading, setHeading]         = useState(0);
  const [qiblaAngle, setQiblaAngle]   = useState(0);
  const [hasPermission, setPermission] = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => {
    // Calculate qibla from user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Makkah coords
        const makkahLat = 21.4225; const makkahLng = 39.8262;
        const dLng = ((makkahLng - lng) * Math.PI) / 180;
        const φ1 = (lat * Math.PI) / 180;
        const φ2 = (makkahLat * Math.PI) / 180;
        const y = Math.sin(dLng) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLng);
        const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
        setQiblaAngle(bearing);
      }, () => {
        // Default Cairo
        setQiblaAngle(134);
        setError('تعذّر تحديد موقعك — تم استخدام موقع افتراضي');
      });
    }

    // Device orientation
    const handleOrientation = (e) => {
      setPermission(true);
      const alpha = e.webkitCompassHeading ?? (e.alpha ? 360 - e.alpha : 0);
      setHeading(alpha);
    };

    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(state => {
          if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation, true);
          else setError('لم يتم السماح بالوصول للبوصلة');
        })
        .catch(() => setError('البوصلة غير مدعومة في هذا الجهاز'));
    } else {
      setPermission(true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  return { heading, qiblaAngle, hasPermission, error };
}

/* ══════════════════════════════
   Main Page
══════════════════════════════ */
export default function TashahadQiblaPage() {
  const [activeTab, setActiveTab] = useState('tashahud');
  const [expanded, setExpanded]   = useState(null);
  const qibla = useQibla();

  const tabs = [
    { id: 'tashahud', label: 'التشهدين', icon: '🤲' },
    { id: 'qibla',    label: 'القبلة',   icon: '🕋' },
  ];

  return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
    <div className="pattern-overlay" style={{ zIndex: 0 }} />
    
    <div className="px-4 py-4 space-y-5" style={{ position: 'relative', zIndex: 1 }}></div>
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          {activeTab === 'tashahud' ? '🤲 التشهدين' : '🕋 اتجاه القبلة'}
        </h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--color-surface)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all relative">
            {activeTab === tab.id && (
              <motion.div layoutId="tq-tab" className="absolute inset-0 rounded-lg"
                style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10 arabic-text"
              style={{ color: activeTab === tab.id ? 'var(--color-gold)' : 'var(--color-text-muted)' }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── التشهدين ── */}
        {activeTab === 'tashahud' && (
          <motion.div key="tashahud" initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-4">

            {tashahudat.map((t, i) => (
              <div key={t.id} className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--color-border)' }}>

                {/* Card header */}
                <button onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                  className="w-full p-4 text-right flex items-center justify-between"
                  style={{ background: 'var(--color-surface)' }}>
                  <motion.span animate={{ rotate: expanded === t.id ? 180 : 0 }}
                    style={{ color: 'var(--color-text-muted)' }}>▼</motion.span>
                  <div className="text-right">
                    <h3 className="font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>{t.title}</h3>
                    <p className="text-xs mt-0.5 arabic-text" style={{ color: 'var(--color-text-muted)' }}>{t.subtitle}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === t.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}>
                      <div className="p-4 space-y-4"
                        style={{ background: 'linear-gradient(to bottom, var(--color-surface), var(--color-surface-2))' }}>

                        {/* Note */}
                        <div className="flex items-start gap-2 p-3 rounded-xl"
                          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <span>📌</span>
                          <p className="arabic-text text-xs" style={{ color: 'var(--color-gold)', lineHeight: 1.8 }}>{t.note}</p>
                        </div>

                        {/* Arabic text */}
                        <div className="p-4 rounded-xl text-center"
                          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                          <p className="text-xs mb-2" style={{ color: 'rgba(212,175,55,0.5)' }}>❝</p>
                          <p className="arabic-text leading-loose"
                            style={{ color: 'var(--color-text)', fontSize: '1.05rem', lineHeight: 2.2 }}>
                            {t.arabic}
                          </p>
                          {t.arabic2 && (
                            <>
                              <div className="my-3 flex items-center gap-2">
                                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                                <span className="text-xs arabic-text" style={{ color: 'var(--color-gold)' }}>{t.arabic2Title}</span>
                                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                              </div>
                              <p className="arabic-text leading-loose"
                                style={{ color: 'var(--color-text)', fontSize: '1.05rem', lineHeight: 2.2 }}>
                                {t.arabic2}
                              </p>
                            </>
                          )}
                          <p className="text-xs mt-2" style={{ color: 'rgba(212,175,55,0.5)' }}>❞</p>
                        </div>

                        {/* Translation */}
                        <div className="p-3 rounded-xl"
                          style={{ background: 'rgba(45,106,79,0.08)', border: '1px solid rgba(45,106,79,0.2)' }}>
                          <p className="text-xs mb-1 font-semibold" style={{ color: '#4ade80' }}>🌐 الترجمة</p>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                            {t.translation}
                          </p>
                        </div>

                        {/* Dua before salam */}
                        {t.dua && (
                          <div className="p-4 rounded-xl text-center"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <p className="text-xs mb-2 font-semibold arabic-text" style={{ color: 'var(--color-gold)' }}>
                              🤲 {t.duaTitle}
                            </p>
                            <p className="arabic-text leading-loose text-sm"
                              style={{ color: 'var(--color-text)', lineHeight: 2.1 }}>
                              {t.dua}
                            </p>
                          </div>
                        )}

                        {/* Steps */}
                        <div className="p-3 rounded-xl"
                          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                          <p className="text-xs font-semibold mb-2 arabic-text" style={{ color: 'var(--color-gold)' }}>
                            📋 خطوات الجلوس
                          </p>
                          <div className="space-y-1.5">
                            {t.steps.map((s, si) => (
                              <div key={si} className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold"
                                  style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                                  {si + 1}
                                </span>
                                <p className="arabic-text text-xs" style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Source */}
                        <div className="text-center">
                          <span className="text-xs px-3 py-1 rounded-full"
                            style={{ background: 'rgba(45,106,79,0.15)', color: '#4ade80' }}>
                            📚 {t.source}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Info card */}
            <div className="rounded-2xl p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-bold text-sm mb-3 arabic-text" style={{ color: 'var(--color-gold)' }}>
                💡 الفرق بين التشهدين
              </h3>
              <div className="space-y-2">
                {[
                  { title: 'التشهد الأول', desc: 'ركن في الصلاة الثلاثية والرباعية — يُقرأ في الجلسة الوسطى دون الصلاة الإبراهيمية' },
                  { title: 'التشهد الأخير', desc: 'ركن في كل صلاة — يُقرأ مع الصلاة الإبراهيمية والدعاء قبل السلام' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: 'var(--color-gold)' }}>✦</span>
                    <div>
                      <p className="text-xs font-semibold arabic-text" style={{ color: 'var(--color-text)' }}>{item.title}:</p>
                      <p className="text-xs arabic-text" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── القبلة ── */}
        {activeTab === 'qibla' && (
          <motion.div key="qibla" initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-4">

            {/* Compass */}
            <div className="rounded-2xl p-6 flex flex-col items-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface-2))',
                border: '1px solid var(--color-border)',
                boxShadow: '0 0 40px rgba(212,175,55,0.06)',
              }}>
              <QiblaCompass {...qibla} />
            </div>

            {/* How to use */}
            <div className="rounded-2xl p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-bold text-sm mb-3 arabic-text" style={{ color: 'var(--color-gold)' }}>
                📱 كيفية استخدام البوصلة
              </h3>
              <div className="space-y-2">
                {[
                  'أمسك هاتفك بشكل أفقي موازٍ للأرض',
                  'ابتعد عن المعادن والأجهزة الكهربائية',
                  'دوّر جسمك حتى تتجه إبرة البوصلة الخضراء للأعلى',
                  'حين يظهر ✅ فأنت تواجه القبلة',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold"
                      style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                      {i + 1}
                    </span>
                    <p className="arabic-text text-xs" style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quran reference */}
            <div className="rounded-2xl p-4 text-center"
              style={{
                background: 'rgba(45,106,79,0.08)',
                border: '1px solid rgba(45,106,79,0.25)',
              }}>
              <p className="arabic-text leading-loose text-sm" style={{ color: '#4ade80', lineHeight: 2 }}>
                (فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ)
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>سورة البقرة — آية 144</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
</div>  );
}
