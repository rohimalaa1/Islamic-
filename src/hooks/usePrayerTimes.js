import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const formatTime = (time24, lang = 'en') => {
  const [h, m] = time24.split(':').map(Number);
  const h12 = h % 12 || 12;
  const mm = m.toString().padStart(2, '0');
  const isAr = lang === 'ar';
  const period = h >= 12
    ? (isAr ? 'م' : 'PM')
    : (isAr ? 'ص' : 'AM');
  if (isAr) {
    const toAr = n => n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    return `${toAr(h12)}:${toAr(mm)} ${period}`;
  }
  return `${h12}:${mm} ${period}`;
};

export const usePrayerTimes = () => {
  const { calculationMethod, location, setLocation } = useApp();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          // Default to Cairo
          resolve({ lat: 30.0444, lng: 31.2357 });
        },
        { timeout: 8000 }
      );
    });
  }, []);

  const fetchPrayerTimes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let coords = location;
      if (!coords) {
        coords = await getUserLocation();
        setLocation(coords);
      }

      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coords.lat}&longitude=${coords.lng}&method=${calculationMethod}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.code === 200) {
        const timings = data.data.timings;
        const times = {
          Fajr: timings.Fajr,
          Sunrise: timings.Sunrise,
          Dhuhr: timings.Dhuhr,
          Asr: timings.Asr,
          Maghrib: timings.Maghrib,
          Isha: timings.Isha,
        };
        setPrayerTimes(times);
        localStorage.setItem('prayerTimes', JSON.stringify({ times, date: dateStr }));
        calculateNextPrayer(times);
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      // Try localStorage cache
      const cached = localStorage.getItem('prayerTimes');
      if (cached) {
        const { times } = JSON.parse(cached);
        setPrayerTimes(times);
        calculateNextPrayer(times);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [calculationMethod, location, getUserLocation, setLocation]);

  const calculateNextPrayer = (times) => {
    const now = new Date();
    const prayers = PRAYER_NAMES.map(name => {
      if (!times[name]) return null;
      const [h, m] = times[name].split(':').map(Number);
      const pTime = new Date(now);
      pTime.setHours(h, m, 0, 0);
      return { name, time: pTime };
    }).filter(Boolean);

    const upcoming = prayers.find(p => p.time > now);
    setNextPrayer(upcoming || prayers[0]);
  };

  // Countdown timer
  useEffect(() => {
    if (!nextPrayer) return;
    const interval = setInterval(() => {
      const now = new Date();
      let diff = nextPrayer.time - now;
      if (diff < 0) {
        // Recalculate
        if (prayerTimes) calculateNextPrayer(prayerTimes);
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer, prayerTimes]);

  useEffect(() => {
    fetchPrayerTimes();
    // Refresh daily
    const refresh = setInterval(fetchPrayerTimes, 24 * 60 * 60 * 1000);
    return () => clearInterval(refresh);
  }, [fetchPrayerTimes]);

  return { prayerTimes, loading, error, nextPrayer, countdown, refetch: fetchPrayerTimes };
};