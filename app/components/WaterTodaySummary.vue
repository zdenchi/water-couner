<script setup lang="ts">
defineProps<{
  total: number
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <div class="flex gap-2 text-xl">
    <span>Today:</span>
    <span class="font-semibold">{{ total.toFixed(2) }}</span>

    <span v-if="loading">Загрузка…</span>
    <span v-else-if="error" class="text-red-500">{{ error }}</span>
  </div>
</template>

