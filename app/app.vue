<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { isPwaInstalled } from './utils/pwa'

const { $pwa } = useNuxtApp()
const toast = useToast()

const offerInstallPrompt = useStorage('offerInstallPrompt', true)
const isPwaInstalledValue = ref(false)

const updatePwaInstalled = () => {
  isPwaInstalledValue.value = isPwaInstalled()
}

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
  updatePwaInstalled()
  window.addEventListener('appinstalled', updatePwaInstalled)

  await nextTick(() => {
    if (
      !isPwaInstalledValue.value &&
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

onBeforeUnmount(() => {
  window.removeEventListener('appinstalled', updatePwaInstalled)
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
