import { isPwaInstalled } from '~/utils/pwa'

export function usePwaInstallPrompt() {
  const { $pwa } = useNuxtApp()
  const toast = useToast()

  const isPwaInstalledValue = ref(false)

  const updatePwaInstalled = () => {
    isPwaInstalledValue.value = isPwaInstalled()
  }

  const showInstallToast = () => {
    if (!import.meta.client) return
    if (isPwaInstalledValue.value) return
    if (!$pwa?.showInstallPrompt) return

    toast.add({
      title: 'Install PWA',
      description: 'Install the app to use it offline and on your home screen.',
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
