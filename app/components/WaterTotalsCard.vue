<script setup lang="ts">
const props = defineProps<{
  totals: {
    currentMonth: number
    lastMonth: number
    allTime: number
  }
}>()
</script>

<template>
  <div
    class="rounded-xl border border-gray-700/50 bg-gray-900/80 p-4 text-gray-100 shadow-lg"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr
            class="border-b border-gray-700/60 text-xs text-gray-400 uppercase"
          >
            <th class="px-2 py-1">Current month</th>
            <th class="px-2 py-1">Last month</th>
            <th class="px-2 py-1">All time</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-sm">
            <td class="px-2 py-2 font-semibold">
              {{ props.totals.currentMonth.toFixed(2) }}
            </td>
            <td class="px-2 py-2 font-semibold">
              {{ props.totals.lastMonth.toFixed(2) }}
            </td>
            <td class="px-2 py-2 font-semibold">
              {{ props.totals.allTime.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
