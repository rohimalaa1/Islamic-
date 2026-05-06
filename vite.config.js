import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // ✅ أهم تعديل

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.webmanifest',
      injectRegister: 'auto',

      includeAssets: [
        'logo-192.png',
        'logo-512.png'
      ],

      manifest: {
        name: 'Islamic App - تطبيق إسلامي',
        short_name: 'Rahim Islamic',
        description: 'Prayer times, Quran, Azkar and more',
        theme_color: '#1a472a',
        background_color: '#0d2318',
        display: 'standalone',
        orientation: 'portrait',

        // ✅ أهم تعديل هنا كمان
        scope: '/',
        start_url: '/',

        icons: [
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg}'],
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
