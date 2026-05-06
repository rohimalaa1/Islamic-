import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/islamic-pwa/', // ✅ هنا بس

  plugins: [
    react(),

    VitePWA({
      // ❌ شيل base من هنا
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.webmanifest',
      injectRegister: 'auto',

      includeAssets: [
        'logo-192.png',
        'logo-512.png',
        'logo-192.png.jpeg',
        'pwa-192x192.png',
      ],

      manifest: {
        name: 'Islamic App - تطبيق إسلامي',
        short_name: 'Rahim Islamic',
        description: 'Prayer times, Quran, Azkar and more',
        theme_color: '#1a472a',
        background_color: '#0d2318',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/islamic-pwa/',
        start_url: '/islamic-pwa/',
        icons: [
          {
            src: 'logo-192.png', // ✅ من غير /islamic-pwa/ هنا
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-512.png', // ✅ من غير /islamic-pwa/ هنا
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg}'], // ✅ أضفنا jpeg
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'aladhan-cache',
              expiration: { maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'quran-cache',
              expiration: { maxAgeSeconds: 604800 }
            }
          }
        ]
      }
    })
  ]
});