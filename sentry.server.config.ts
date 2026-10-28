import * as Sentry from '@sentry/nuxt'

// This file runs before Nuxt runtime config exists, so the DSN comes from the env.
const env = (
  globalThis as {
    process?: { env: Record<string, string | undefined> }
  }
).process?.env

Sentry.init({
  dsn: env?.NUXT_PUBLIC_SENTRY_DSN,
  environment: import.meta.dev ? 'development' : 'production',
  tracesSampleRate: 1.0,
})
