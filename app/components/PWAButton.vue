<script setup lang="ts">
const nuxtApp = useNuxtApp()

const installPwa = () => {
  const pwa = nuxtApp.$pwa
  if (pwa?.showInstallPrompt) {
    pwa.install()
  }
}
</script>

<template>
  <ClientOnly>
    <UButton v-if="$pwa?.showInstallPrompt" @click="installPwa">
      Install PWA
    </UButton>
  </ClientOnly>
</template>