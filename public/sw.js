const CACHE_NAME = 'islamic-app-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// 📦 Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );

  self.skipWaiting();
});

// ♻️ Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// 🌐 Fetch (FIXED & SAFE)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 🚫 تجاهل الصوت والملفات الخارجية الثقيلة
  if (
    url.hostname.includes('islamic.network') ||
    url.pathname.includes('.mp3')
  ) {
    return;
  }

  // 📡 API requests
  if (
    url.href.includes('api.alquran.cloud') ||
    url.href.includes('api.aladhan.com')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          return res;
        })
        .catch(() => {
          return new Response(JSON.stringify({ error: 'Network Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 📦 باقي الملفات (Cache First + Safe fallback)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((res) => res)
        .catch(() => {
          return new Response('Offline', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    })
  );
});

// 🔔 Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || 'Islamic App 🕌', {
      body: data.body || 'حان وقت الصلاة',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: data.tag || 'prayer',
    })
  );
});

// 📲 Click notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});