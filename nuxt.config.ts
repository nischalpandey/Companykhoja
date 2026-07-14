import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // ── App Configuration ─────────────────────────────────────────────────────
  app: {
    // baseURL: process.env.NODE_ENV === 'production' ? '/Companykhoja/' : '/',
    baseURL: '/', // for custom domain deployment, set this to '/'
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      titleTemplate: '%s | CompanyKhoja - Nepal Company Search',
      meta: [
        { name: 'description', content: 'Open-source search engine for registered companies in Nepal. Search by name, registration number, address, and more.' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'msapplication-TileColor', content: '#0f172a' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'CompanyKhoja' },
        { property: 'og:image', content: '/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@companykhoja' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  // ── Modules ───────────────────────────────────────────────────────────────
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  // ─- Color Mode ────────────────────────────────────────────────────────────
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
    dataValue: 'theme',
  },

  // ── TailwindCSS ───────────────────────────────────────────────────────────
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    viewer: false,
  },

  // ── TypeScript ────────────────────────────────────────────────────────────
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },

  // ── Vite ──────────────────────────────────────────────────────────────────
  vite: {
    build: {
      target: 'esnext',
      cssMinify: true,
          sourcemap: false,

      rollupOptions: {
        output: {
          manualChunks: {
            'chart-vendor': ['chart.js', 'vue-chartjs'],
            'search-vendor': ['minisearch', 'fuse.js'],
            'utils-vendor': ['qrcode'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['minisearch', 'fuse.js', 'chart.js', 'qrcode'],
    },
  },

  // ── Nitro (Static Generation) ─────────────────────────────────────────────
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/search', '/statistics', '/categories', '/about', '/faq', '/privacy', '/disclaimer', '/api-docs'],
      ignore: ['/sitemap.xml', '/robots.txt', '/manifest.json'],
    },
    routeRules: {
      '/data/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
  },



  // ─- Server routes are handled client-side ─────────────────────────────────
  // API routes (server/api/) exist for development convenience only.
  // In the static build, all search/stats logic runs in the browser
  // via the useClientSearch composable, which loads companies.json directly.

  // ─- Runtime Config ────────────────────────────────────────────────────────
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://companykhoja.ngp.com.np',
      baseURL: '/',
      // siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://nischalpandey.github.io/Companykhoja',
      // baseURL: process.env.NODE_ENV === 'production' ? '/Companykhoja/' : '/',
      version: '1.0.0',
    },
  },

  // ── Imports ───────────────────────────────────────────────────────────────
  imports: {
    dirs: ['composables/**', 'utils/**', 'types/**'],
    presets: [
      {
        from: 'vue',
        imports: ['ref', 'computed', 'watch', 'onMounted', 'onUnmounted', 'nextTick', 'shallowRef', 'triggerRef'],
      },
    ],
  },

  // ─- Components ────────────────────────────────────────────────────────────
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // ─- Experimental ───────────────────────────────────────────────────────────
  experimental: {
    payloadExtraction: true,
    typedPages: true,
    viewTransition: true,
      renderJsonPayloads: true,

  },

  // ─- DevTools ───────────────────────────────────────────────────────────────
  devtools: {
    enabled: true,
  },

  // ─- Compatibility ──────────────────────────────────────────────────────────
  compatibilityDate: '2024-04-01',
})
