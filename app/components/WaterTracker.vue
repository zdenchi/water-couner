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
  <div class="m-2 flex flex-col gap-4 rounded-lg bg-zinc-800 p-2">
    <div class="flex items-center gap-4">
      <WaterControls
        v-model:count="count"
        :loading="loading"
        @drink="onDrink"
      />

      <WaterTodaySummary :total="total" :loading="loading" :error="error" />
    </div>

    <WaterTotalsCard v-if="totals" :totals="totals" />

    <LazyWaterHistoryCard v-if="lastThreeDays.length" :days="lastThreeDays" />
  </div>
</template>
