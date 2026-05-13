import { useState, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';

const ADHAN_AUDIO_URL = 'https://www.islamcan.com/audio/adhan/azan1.mp3';

const PRAYER_LABELS = {
  Fajr:    { ar: 'الفجر'  },
  Sunrise: { ar: 'الشروق' },
  Dhuhr:   { ar: 'الظهر'  },
  Asr:     { ar: 'العصر'  },
  Maghrib: { ar: 'المغرب' },
  Isha:    { ar: 'العشاء' },
};

export const useNotifications = () => {
  const { notificationsEnabled, setNotificationsEnabled, adhanSound, preAdhanAlert } = useApp();
  const [permission, setPermission]   = useState(Notification.permission);
  const [activeAdhan, setActiveAdhan] = useState(null);
  const [adhanMuted,  setAdhanMuted]  = useState(false);
  const timersRef = useRef([]);
  const adhanRef  = useRef(null);

  /* ─── helpers ─────────────────────────────────────────── */

  const clearAllTimers = () => {
    timersRef.current.forEach(id => clearTimeout(id));
    timersRef.current = [];
  };

  const stopAdhan = useCallback(() => {
    if (adhanRef.current) {
      adhanRef.current.pause();
      adhanRef.current.currentTime = 0;
      adhanRef.current = null;
    }
  }, []);

  // ✅ بتتحقق من adhanSound قبل ما تشغل أي صوت
  const playAdhan = useCallback(() => {
    if (!adhanSound) return;
    try {
      stopAdhan();
      const audio = new Audio(ADHAN_AUDIO_URL);
      audio.volume = 0.8;
      adhanRef.current = audio;
      audio.play().catch(() => {});
    } catch (e) {}
  }, [stopAdhan, adhanSound]);

  /* ─── mute toggle ──────────────────────────────────────── */

  const toggleAdhanMute = useCallback(() => {
    setAdhanMuted(prev => {
      const nowMuted = !prev;
      if (nowMuted) {
        stopAdhan();
      } else if (adhanRef.current === null) {
        playAdhan();
      }
      return nowMuted;
    });
  }, [stopAdhan, playAdhan]);

  /* ─── dismiss badge ────────────────────────────────────── */

  const dismissAdhan = useCallback(() => {
    stopAdhan();
    setActiveAdhan(null);
    setAdhanMuted(false);
  }, [stopAdhan]);

  /* ─── permission ───────────────────────────────────────── */

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setNotificationsEnabled(true);
      new Notification('تطبيق إسلامي 🌙', {
        body: 'تم تفعيل الإشعارات بنجاح',
        icon: '/pwa-192x192.png',
      });
      return true;
    }
    return false;
  }, [setNotificationsEnabled]);

  /* ─── schedule ─────────────────────────────────────────── */

  const scheduleNotifications = useCallback((prayerTimes) => {
    clearAllTimers();
    if (!prayerTimes) return;

    Object.entries(PRAYER_LABELS).forEach(([prayer, label]) => {
      const timeStr = prayerTimes[prayer];
      if (!timeStr) return;

      const [h, m] = timeStr.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(h, m, 0, 0);
      const now = Date.now();

      // تنبيه قبل 10 دقائق
      if (preAdhanAlert && prayer !== 'Sunrise') {
        const preDelay = prayerTime - now - 10 * 60 * 1000;
        if (preDelay > 0) {
          const tid = setTimeout(() => {
            if (Notification.permission === 'granted' && notificationsEnabled) {
              new Notification(`⏰ باقي 10 دقائق — ${label.ar}`, {
                body: `استعد لصلاة ${label.ar}`,
                icon: '/pwa-192x192.png',
                tag: 'pre-' + prayer,
              });
            }
          }, preDelay);
          timersRef.current.push(tid);
        }
      }

      // وقت الصلاة
      const delay = prayerTime - now;
      if (delay > 0) {
        const tid = setTimeout(() => {
          if (prayer !== 'Sunrise') {
            setActiveAdhan({ prayer, nameAr: label.ar, time: timeStr });
            setAdhanMuted(false);
          }
          if (Notification.permission === 'granted' && notificationsEnabled) {
            new Notification(`🕌 حان وقت صلاة ${label.ar}`, {
              body: `${label.ar} — ${timeStr}`,
              icon: '/pwa-192x192.png',
              tag: 'prayer-' + prayer,
              requireInteraction: true,
            });
          }
          if (prayer !== 'Sunrise') playAdhan();
        }, delay);
        timersRef.current.push(tid);
      }
    });
  }, [notificationsEnabled, adhanSound, preAdhanAlert, playAdhan]);

  /* ─── toggle notifications ─────────────────────────────── */

  const toggle = useCallback(async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      clearAllTimers();
    } else {
      if (permission === 'granted') setNotificationsEnabled(true);
      else await requestPermission();
    }
  }, [notificationsEnabled, permission, requestPermission, setNotificationsEnabled]);

  /* ─── test notification ────────────────────────────────── */

  const sendTestNotification = useCallback(() => {
    if (permission === 'granted') {
      new Notification('تطبيق إسلامي 🌙', {
        body: 'إشعار تجريبي — Test Notification',
        icon: '/pwa-192x192.png',
      });
    }
  }, [permission]);

  return {
    permission,
    notificationsEnabled,
    requestPermission,
    scheduleNotifications,
    sendTestNotification,
    playAdhan,
    toggle,
    activeAdhan,
    adhanMuted,
    toggleAdhanMute,
    dismissAdhan,
  };
};