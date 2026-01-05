
/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      // PWA Configuration
      // Makes the app installable and capable of working offline.
      VitePWA({
        registerType: 'autoUpdate', // Updates service worker automatically
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Teclado Mágico',
          short_name: 'Teclado Mágico',
          description: 'Aprende a teclar com magia! Um treinador de digitação para crianças em Portugal e Angola.',
          theme_color: '#F43F5E', // Rose-500 default theme color
          background_color: '#FDF6F0', // Cream background to match body
          display: 'standalone', // Feels like a native app
          orientation: 'landscape', // Force landscape for keyboard space
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable' // Ensures icon looks good on Android rounded shapes
            }
          ]
        },
        workbox: {
          // Caching Strategy:
          // We cache Google Fonts aggressively to ensure text renders correctly offline.
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    // Explicitly define process.env for client-side usage
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});