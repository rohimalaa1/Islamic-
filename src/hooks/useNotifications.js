import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const useNotifications = () => {
  const { notificationsEnabled, setNotificationsEnabled } = useApp();
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      setNotificationsEnabled(true);
      new Notification('Islamic App 🌙', {
        body: 'Notifications enabled! You will receive prayer time reminders.',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
      });
      return true;
    }
    return false;
  }, [setNotificationsEnabled]);

  const scheduleNotifications = useCallback((prayerTimes) => {
    if (!notificationsEnabled || permission !== 'granted' || !prayerTimes) return;

    const prayerLabels = {
      Fajr: 'الفجر - Fajr',
      Sunrise: 'الشروق - Sunrise',
      Dhuhr: 'الظهر - Dhuhr',
      Asr: 'العصر - Asr',
      Maghrib: 'المغرب - Maghrib',
      Isha: 'العشاء - Isha',
    };

    Object.entries(prayerTimes).forEach(([prayer, timeStr]) => {
      const [h, m] = timeStr.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(h, m, 0, 0);

      const delay = prayerTime - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`🕌 ${prayerLabels[prayer]}`, {
              body: `حان وقت صلاة ${prayerLabels[prayer]}`,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: `prayer-${prayer}`,
              requireInteraction: false,
              silent: false,
            });
          }
        }, delay);
      }
    });
  }, [notificationsEnabled, permission]);

  const sendTestNotification = useCallback(() => {
    if (permission === 'granted') {
      new Notification('Islamic App 🌙', {
        body: 'Test notification - إشعار تجريبي',
        icon: '/pwa-192x192.png',
      });
    }
  }, [permission]);

  const toggle = useCallback(async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
    } else {
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      } else {
        await requestPermission();
      }
    }
  }, [notificationsEnabled, permission, requestPermission, setNotificationsEnabled]);

  return {
    permission,
    notificationsEnabled,
    requestPermission,
    scheduleNotifications,
    sendTestNotification,
    toggle,
  };
};
