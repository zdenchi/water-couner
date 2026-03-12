<script setup lang="ts">
import { formatAmount } from '../utils/waterFormat'

defineProps<{
  total: number
  loading: boolean
  error: string | null
}>()

// Avoid hydration mismatch: server may render different locale; show label only after mount
const loadingLabel = ref('')
onMounted(() => {
  loadingLabel.value = 'Loading…'
})
</script>

<template>
  <div class="flex gap-2 text-xl">
    <span>Today:</span>
    <span class="font-semibold">{{ formatAmount(total) }}</span>

    <span v-if="loading">{{ loadingLabel }}</span>
    <span v-else-if="error" class="text-red-500">{{ error }}</span>
  </div>
</template>
