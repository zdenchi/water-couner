<script setup lang="ts">
import { formatAmount } from '../utils/waterFormat'

defineProps<{
  total: number
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <div class="flex items-center gap-2 text-xl">
    <span>Today:</span>
    <span v-if="!loading && !error" class="font-semibold">{{
      formatAmount(total)
    }}</span>
  </div>
</template>
