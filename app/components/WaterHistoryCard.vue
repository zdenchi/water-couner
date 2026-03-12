<script setup lang="ts">
import { formatAmount, formatDateKey, formatTime } from '../utils/waterFormat'
import type { DayData } from '../types/water'

const props = defineProps<{
  days: DayData[]
}>()
</script>

<template>
  <div
    class="rounded-xl border border-gray-700/50 bg-gray-900/80 p-4 text-gray-100 shadow-lg"
  >
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="day in days"
        :key="day.dateKey"
        class="flex flex-col rounded-lg bg-gray-800/50 p-3"
      >
        <div class="text-sm font-medium text-gray-300">
          {{ formatDateKey(day.dateKey) }}
        </div>
        <div class="text-xs text-gray-400">
          Total:
          <span class="font-semibold text-gray-200">{{
            formatAmount(day.total)
          }}</span>
        </div>
        <ul class="mt-2 space-y-0.5 text-xs">
          <li v-for="e in day.events" :key="e.id ?? e.at" class="flex gap-2">
            <span class="w-8">{{ formatTime(e.at) }}</span>
            <span>–</span>
            <span>{{ formatAmount(e.amount) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
