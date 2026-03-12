export function isPwaInstalled(): boolean {
  if (!import.meta.client) return false

  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }

  const navigatorStandalone = (
    window.navigator as Navigator & { standalone?: boolean }
  ).standalone

  return navigatorStandalone === true
}
