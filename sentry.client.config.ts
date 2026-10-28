import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: useRuntimeConfig().public.sentry.dsn,
  environment: import.meta.dev ? 'development' : 'production',
  tracesSampleRate: 1.0,
})
