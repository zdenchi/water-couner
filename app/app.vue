<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const { $pwa } = useNuxtApp()
const toast = useToast()

const offerInstallPrompt = useStorage('offerInstallPrompt', true)
const isPWAInstalled = computed(() => {
  if (import.meta.client) {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
  }
})

const actions = [
  {
    variant: 'solid',
    color: 'success',
    label: 'Install',
    onClick: (e: Event) => {
      e.stopPropagation()
      installPwa()
    },
  },
  {
    label: 'Close',
    onClick: (e: Event) => {
      e.stopPropagation()
      offerInstallPrompt.value = false
    },
  },
]

function installPwa() {
  if ($pwa?.showInstallPrompt) {
    $pwa.install()
    offerInstallPrompt.value = false
  }
}

onMounted(async () => {
  await nextTick(() => {
    if (
      !isPWAInstalled.value &&
      offerInstallPrompt.value &&
      $pwa?.showInstallPrompt
    ) {
      toast.add({
        title: 'Install PWA',
        description:
          'Install the app to use it offline and on your home screen.',
        duration: 0,
        id: 'install-pwa',
        actions: [
          {
            variant: 'solid',
            color: 'success',
            label: 'Install',
            onClick: (e) => {
              e.stopPropagation()
              installPwa()
            },
          },
          {
            label: 'Close',
            onClick: (e) => {
              e.stopPropagation()
              offerInstallPrompt.value = false
            },
          },
        ],
      })
    }
  })
})
</script>

<template>
  <UApp>
    <UMain>
      <NuxtPwaManifest />
      <NuxtPage />
    </UMain>
  </UApp>
</template>
