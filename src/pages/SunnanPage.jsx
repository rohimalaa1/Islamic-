import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
// تأكد من صحة مسارات الاستيراد واسم الملف في data
import { sunnahMuakkada, otherSunnan, dailySunnan,fridaySunnan } from "../data/sunnan";

export default function SunnanPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [selected, setSelected] = useState(null);

  // دالة مساعدة لجلب النص الصحيح (عربي/إنجليزي)
  const getTxt = (item, arKey, enKey) => {
    return isAr ? item[arKey] : (item[enKey] || item[arKey]);
  };

  const categories = [
    {
      id: 1,
      title: t('sunnah_muakkada', 'السنن الرواتب'),
      icon: "🌙",
      data: sunnahMuakkada || [],
    },
     {
      id: 2,
      title: t('friday_sunnan', 'سنن يوم الجمعة'),
      icon: "🕌",
      data: fridaySunnan || [], // تأكد من تعريف هذه المصفوفة في ملف البيانات
      isSpecial: true, // علامة اختيارية لتمييز التصميم
    },
    {
      id: 3,
      title: t('other_sunnan', 'سنن أخرى'),
      icon: "✨",
      data: otherSunnan || [],
    },
    {
      id: 4,
      title: t('daily_sunnan', 'سنن يومية'),
      icon: "📿",
      data: dailySunnan || [],
    },
   
  ];

  return (
    <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-xl font-bold ${isAr ? 'arabic-text' : ''}`} style={{ color: "var(--color-gold)" }}>
          ✨ {t('sunnan_title', 'السنن النبوية')}
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          {t('sunnan_subtitle', 'اقتدي بالنبي ﷺ وازد أجرًا يوميًا 🤍')}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(cat)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className={`text-xs font-semibold ${isAr ? 'arabic-text' : ''}`}
                  style={{ color: "var(--color-text)" }}>
                  {cat.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    color: "var(--color-gold)",
                  }}>
                  {cat.data.length} {isAr ? 'عنصر' : 'Items'}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isAr ? -20 : 20 }}
          >
            {/* Header Details */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selected.icon}</span>
                <h2 className={`font-bold ${isAr ? 'arabic-text' : ''}`}
                  style={{ color: "var(--color-gold)" }}>
                  {selected.title}
                </h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: "var(--color-surface-2)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {isAr ? '← رجوع' : '← Back'}
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {selected.data.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl p-5"
                  style={{
                    background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <h3 className={`text-center mb-2 font-bold ${isAr ? 'arabic-text' : ''}`}
                    style={{ color: "var(--color-gold)" }}>
                    {getTxt(item, 'prayer', 'prayerEn') || getTxt(item, 'title', 'titleEn')}
                  </h3>

                  {(item.detail || item.detailEn) && (
                    <p className="text-sm text-center mb-3 opacity-90"
                      style={{ color: "var(--color-text)" }}>
                      {getTxt(item, 'detail', 'detailEn')}
                    </p>
                  )}

                  {(item.description || item.descriptionEn) && (
                    <p className="text-sm text-center mb-3 opacity-90"
                      style={{ color: "var(--color-text)" }}>
                      {getTxt(item, 'description', 'descriptionEn')}
                    </p>
                  )}

                  {item.hadith && (
                    <p className="arabic-text text-center leading-loose mb-3"
                      style={{ color: "var(--color-text)", fontSize: '0.95rem' }}>
                      {item.hadith}
                    </p>
                  )}

                  {/* 🟢 قسم الدعاء المضاف حديثاً */}
                  {item.dua && (
                    <div className="mt-3 p-3 rounded-xl border-2 border-dashed mb-4" 
                         style={{ borderColor: 'var(--color-gold)', background: 'rgba(212,175,55,0.05)' }}>
                      <p className="text-[10px] font-bold mb-1" style={{ color: 'var(--color-gold)' }}>
                        {isAr ? '🤲 الدعاء الوارد:' : '🤲 The Supplication:'}
                      </p>
                      <p className="arabic-text text-sm leading-relaxed text-center" style={{ color: "var(--color-text)" }}>
                        {item.dua}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center pt-2"
                    style={{ borderTop: "1px solid var(--color-border)" }}>
                    <span className="text-[10px] px-3 py-1 rounded-full font-medium"
                      style={{
                        background: "rgba(45,106,79,0.15)",
                        color: "#4ade80",
                      }}>
                      📚 {getTxt(item, 'source', 'sourceEn') || item.source}
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