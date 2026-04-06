import { isPwaInstalled } from '~/utils/pwa'

export function usePwaInstallPrompt() {
  const { $pwa } = useNuxtApp()
  const toast = useToast()

  const isPwaInstalledValue = ref(false)

  const updatePwaInstalled = () => {
    isPwaInstalledValue.value = isPwaInstalled()
  }

  const isIosDevice = () => {
    if (!import.meta.client) return false

    const ua = window.navigator.userAgent.toLowerCase()
    const isIos = /iphone|ipad|ipod/.test(ua)
    // iPadOS 13+ Safari uses a desktop-like UA; avoid deprecated navigator.platform
    const isIpadDesktopUa = navigator.maxTouchPoints > 1 && /macintosh/.test(ua)

    return isIos || isIpadDesktopUa
  }

  const showInstallToast = () => {
    if (!import.meta.client) return
    if (isPwaInstalledValue.value) return

    if ($pwa?.showInstallPrompt) {
      toast.add({
        title: 'Install PWA',
        description:
          'Install the app to use it offline and on your home screen.',
        duration: 0,
        id: 'install-pwa',
        ui: {
          root: 'relative p-6 rounded-xl',
          title: 'text-lg font-semibold',
          description: 'text-base',
          actions: 'mt-3 gap-2',
          close: 'absolute right-2 top-2 text-white hover:text-white/80',
        },
        close: {
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
        },
        closeIcon: 'i-lucide-x',
        actions: [
          {
            variant: 'solid',
            color: 'success',
            size: 'lg',
            label: 'Install',
            onClick: (e) => {
              e.stopPropagation()
              installPwa()
            },
          },
        ],
      })
      return
    }

    if (isIosDevice()) {
      toast.add({
        title: 'Добавить на главный экран',
        description: 'Нажмите «Поделиться», затем «На экран “Домой”».',
        duration: 0,
        id: 'install-pwa',
        ui: {
          root: 'relative p-6 rounded-xl bg-zinc-800',
          title: 'text-lg font-semibold',
          description: 'text-base',
          close: 'absolute right-2 top-2 text-white hover:text-white/80',
        },
        close: {
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
        },
        closeIcon: 'i-lucide-x',
      })
    }
  }

  function installPwa() {
    if ($pwa?.showInstallPrompt) {
      $pwa.install()
    }
  }

  onMounted(async () => {
    updatePwaInstalled()
    window.addEventListener('appinstalled', updatePwaInstalled)

    await nextTick(() => {
      showInstallToast()
    })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('appinstalled', updatePwaInstalled)
  })

  watch(
    () => $pwa?.showInstallPrompt,
    (ready) => {
      if (ready) showInstallToast()
    },
    { immediate: true },
  )

  return {
    isPwaInstalledValue,
  }
}
