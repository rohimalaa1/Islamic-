import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../hooks/useNotifications';

const CALCULATION_METHODS = [
  { value: 1,  label: 'University of Islamic Sciences, Karachi' },
  { value: 2,  label: 'Islamic Society of North America (ISNA)' },
  { value: 3,  label: 'Muslim World League' },
  { value: 4,  label: 'Umm Al-Qura University, Makkah' },
  { value: 5,  label: 'Egyptian General Authority of Survey' },
  { value: 12, label: 'Union Organization Islamic de France' },
  { value: 13, label: 'Diyanet İşleri Başkanlığı, Turkey' },
];

const SettingRow = ({ icon, label, sub, children }) => (
  <div className="flex items-center justify-between py-4"
    style={{ borderBottom: '1px solid var(--color-border)' }}>
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>}
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className="relative w-12 h-6 rounded-full transition-all"
    style={{
      background: value ? 'var(--color-gold)' : 'var(--color-surface-2)',
      border: '1px solid var(--color-border)',
      flexShrink: 0,
    }}>
    <motion.div
      animate={{ x: value ? 24 : 2 }}
      className="absolute top-0.5 w-5 h-5 rounded-full"
      style={{ background: value ? '#0d2318' : 'var(--color-text-muted)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    />
  </button>
);

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const {
    darkMode, setDarkMode,
    language, setLanguage,
    adhanSound, setAdhanSound,
    preAdhanAlert, setPreAdhanAlert,
    calculationMethod, setCalculationMethod,
  } = useApp();
  const { permission, notificationsEnabled, toggle, sendTestNotification, playAdhan } = useNotifications();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="pattern-overlay" style={{ zIndex: 0 }} />

      <div className="px-4 py-4 space-y-5" style={{ position: 'relative', zIndex: 1 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          ⚙️ {t('settings')}
        </h1>

        {/* الإعدادات العامة */}
        <section className="rounded-2xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            🎨 {t('general')}
          </h2>
          <SettingRow icon="🌙" label={t('dark_mode')}>
            <Toggle value={darkMode} onChange={setDarkMode} />
          </SettingRow>
          <SettingRow icon="🌐" label={t('language')}>
            <div className="flex gap-2">
              {['ar', 'en'].map(lang => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: language === lang ? 'var(--color-gold)' : 'var(--color-surface-2)',
                    color:      language === lang ? '#0d2318'           : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                  }}>
                  {lang === 'ar' ? 'عربي' : 'EN'}
                </button>
              ))}
            </div>
          </SettingRow>
        </section>

        {/* الإشعارات */}
        <section className="rounded-2xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            🔔 {t('notification_settings')}
          </h2>

          <SettingRow icon="🔔" label={t('enable_notifications')}>
            <Toggle value={notificationsEnabled} onChange={toggle} />
          </SettingRow>

          <SettingRow icon="🔊" label={t('sound')} sub="صوت الأذان عند وقت الصلاة">
            <Toggle value={adhanSound} onChange={setAdhanSound} />
          </SettingRow>

          <SettingRow icon="⏰" label={t('pre_adhan_alert', 'تنبيه قبل الأذان')} sub="إشعار قبل الصلاة بـ 10 دقائق">
            <Toggle value={preAdhanAlert} onChange={setPreAdhanAlert} />
          </SettingRow>

          {/* زرار تشغيل الأذان يدوياً */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={playAdhan}
            className="mt-3 w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: adhanSound ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
              color:      adhanSound ? 'var(--color-gold)'     : 'var(--color-text-muted)',
              border: `1px solid ${adhanSound ? 'rgba(212,175,55,0.35)' : 'var(--color-border)'}`,
              cursor: adhanSound ? 'pointer' : 'not-allowed',
            }}
          >
            🔊 {adhanSound ? 'تشغيل الأذان' : 'الصوت مكتوم'}
          </motion.button>

          {permission === 'granted' && (
            <button onClick={sendTestNotification}
              className="mt-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(212,175,55,0.08)',
                color: 'var(--color-gold)',
                border: '1px solid rgba(212,175,55,0.25)',
              }}>
              🧪 إرسال إشعار تجريبي
            </button>
          )}

          {permission === 'denied' && (
            <p className="text-xs mt-3 text-center" style={{ color: '#f87171' }}>
              ⚠️ الإشعارات محظورة — يرجى تفعيلها من إعدادات المتصفح
            </p>
          )}
        </section>

        {/* طريقة حساب الصلاة */}
        <section className="rounded-2xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-muted)' }}>
            🕌 {t('calculation_method')}
          </h2>
          <div className="space-y-2">
            {CALCULATION_METHODS.map(method => (
              <button key={method.value} onClick={() => setCalculationMethod(method.value)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all"
                style={{
                  background: calculationMethod === method.value ? 'rgba(212,175,55,0.15)' : 'var(--color-surface-2)',
                  border:     calculationMethod === method.value ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--color-border)',
                  color:      calculationMethod === method.value ? 'var(--color-gold)' : 'var(--color-text-muted)',
                }}>
                {calculationMethod === method.value && '✓ '}{method.label}
              </button>
            ))}
          </div>
        </section>

        {/* About */}
        <div className="text-center py-4">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Islamic App v1.0 • Made with ❤️ for Muslims
          </p>
          <p className="arabic-text text-sm mt-2" style={{ color: 'var(--color-gold)', opacity: 0.7 }}>
            وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
          </p>
          <p className="arabic-text text-sm mt-2" style={{ color: 'var(--color-gold)', opacity: 0.7 }}>
            تم التصميم بواسطة رحيم 🤍
          </p>
          <p className="arabic-text text-sm mt-2" style={{ color: 'var(--color-gold)', opacity: 0.7 }}>
            نسألكم الدعاء
          </p>
        </div>
      </div>
    </div>
  );
}