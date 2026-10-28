export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  void $fetch('/api/visits', {
    method: 'POST',
    body: {
      path: to.fullPath,
    },
  }).catch(() => {
    // Logging must not block navigation when the API is unavailable.
  })
})
