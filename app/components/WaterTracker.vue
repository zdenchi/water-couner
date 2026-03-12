<script setup lang="ts">
import { useWaterTracker } from '../composables/useWaterTracker'

const count = ref(1.5)
const { total, totals, lastThreeDays, loading, error, drink } =
  useWaterTracker()

const onDrink = () => {
  const amount = Number(count.value)
  drink(amount)
}
</script>

<template>
  <div class="flex flex-col gap-4 rounded-lg bg-zinc-800 p-2">
    <div class="flex items-center gap-4">
      <WaterControls v-model:count="count" :loading="loading" @drink="onDrink" />

      <WaterTodaySummary :total="total" :loading="loading" :error="error" />
    </div>

    <div
      v-if="loading && !totals"
      class="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-4"
    >
      <div class="flex gap-4">
        <USkeleton class="h-8 w-24" />
        <USkeleton class="h-8 w-24" />
        <USkeleton class="h-8 w-24" />
      </div>
    </div>
    <WaterTotalsCard v-else-if="totals" :totals="totals" />

    <div
      v-if="loading && !lastThreeDays.length"
      class="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-4"
    >
      <div class="grid grid-cols-3 gap-4">
        <USkeleton v-for="i in 3" :key="i" class="h-24 rounded-lg" />
      </div>
    </div>
    <LazyWaterHistoryCard v-else-if="lastThreeDays.length" :days="lastThreeDays" />
  </div>
</template>
