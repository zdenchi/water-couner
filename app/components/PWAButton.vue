<script setup lang="ts">
import { isPwaInstalled } from '../utils/pwa'

const nuxtApp = useNuxtApp()
const isInstalled = ref(false)

const updateInstalled = () => {
  isInstalled.value = isPwaInstalled()
}

const installPwa = () => {
  const pwa = nuxtApp.$pwa
  if (pwa?.showInstallPrompt) {
    pwa.install()
  }
}

onMounted(() => {
  updateInstalled()
  window.addEventListener('appinstalled', updateInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('appinstalled', updateInstalled)
})
</script>

<template>
  <ClientOnly>
    <UButton v-if="!isInstalled && $pwa?.showInstallPrompt" @click="installPwa">
      Install PWA
    </UButton>
  </ClientOnly>
</template>