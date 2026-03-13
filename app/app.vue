<script setup lang="ts">
import { usePwaInstallPrompt } from '~/composables/usePwaInstallPrompt'

usePwaInstallPrompt()
</script>

<template>
  <UApp>
    <UMain>
      <NuxtPwaManifest />
      <NuxtPage />
    </UMain>
  </UApp>
</template>
