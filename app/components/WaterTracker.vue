<script setup lang="ts">
import { useWaterTracker } from '../composables/useWaterTracker'

const lastAmountCookie = useCookie<number | null>('water-last-amount', {
  default: () => 1.5,
})

const count = ref(lastAmountCookie.value ?? 1.5)
const { total, totals, lastThreeDays, loading, error, drink, updateDrinkTime } =
  useWaterTracker()

const onDrink = () => {
  const amount = Number(count.value)
  if (Number.isNaN(amount)) {
    return
  }

  drink(amount)
  lastAmountCookie.value = amount
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

    <LazyWaterHistoryCard
      v-if="lastThreeDays.length"
      :days="lastThreeDays"
      :loading="loading"
      @edit-time="updateDrinkTime"
    />
  </div>
</template>
