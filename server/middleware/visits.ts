export default defineEventHandler((event) => {
  if (event.method !== 'GET') return

  const path = getRequestURL(event).pathname
  if (
    path.startsWith('/_nuxt') ||
    path.startsWith('/icons') ||
    path.startsWith('/api') ||
    path.includes('.')
  ) {
    return
  }

  addVisit({
    ip: getRequestIP(event, { xForwardedFor: true }) ?? 'unknown',
    path,
    at: new Date().toISOString(),
  })
})
