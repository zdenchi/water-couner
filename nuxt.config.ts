// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = import.meta.dev

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      buildMarker: new Date().toISOString(),
    },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'BCounter',
    },
  },

  modules: [
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    ...(isDev ? ['@nuxt/eslint', '@nuxt/hints'] : []),
  ],

  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
      },
    ],
  },

  routeRules: {
    '/': { prerender: true },
  },

  nitro: {
    preset: 'vercel-static',
  },

  pwa: {
    registerType: 'autoUpdate',
    client: { installPrompt: true },
    manifest: {
      name: 'BCounter',
      short_name: 'BCounter',
      start_url: '/',
      display: 'standalone',
      background_color: '#111827',
      theme_color: '#111827',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,webp}'],
    },
  },
})
