export default defineEventHandler((event) => {
  if (event.method !== 'GET') return

  const url = getRequestURL(event)
  const path = url.pathname
  const fetchDestination = getHeader(event, 'sec-fetch-dest')
  if (
    path.startsWith('/_nuxt') ||
    path.startsWith('/api') ||
    !path.includes('.') ||
    (fetchDestination && fetchDestination !== 'document')
  ) {
    return
  }

  addVisit({
    ip: getRequestIP(event, { xForwardedFor: true }) ?? 'unknown',
    path: `${path}${url.search}`,
    at: new Date().toISOString(),
  })
})
