<script setup lang="ts">
import { formatAmount, formatDateKey, formatTime } from '../utils/waterFormat'
import type { DayData, DrinkRecord } from '../types/water'

const props = defineProps<{
  days: DayData[]
  loading?: boolean
}>()
const carouselStartIndex = computed(() => Math.max(props.days.length - 2, 0))

const emit = defineEmits<{
  (e: 'edit-record', record: DrinkRecord, at: string, amount: number): void
}>()

const isModalOpen = ref(false)
const selectedRecord = ref<DrinkRecord | null>(null)

const onEditClick = (record: DrinkRecord) => {
  selectedRecord.value = record
  isModalOpen.value = true
}

const onSaveEdit = (at: string, amount: number) => {
  if (!selectedRecord.value) return

  emit('edit-record', selectedRecord.value, at, amount)
  isModalOpen.value = false
  selectedRecord.value = null
}

watch(isModalOpen, (open) => {
  if (!open) {
    selectedRecord.value = null
  }
})
</script>

<template>
  <div
    class="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-4 text-gray-100 shadow-lg"
  >
    <UCarousel
      :items="days"
      class="w-full"
      :ui="{ item: 'basis-1/2' }"
      :start-index="carouselStartIndex"
      align="start"
    >
      <template #default="{ item: day }">
        <div
          :key="day.dateKey"
          class="flex flex-col rounded-lg bg-zinc-800/50 p-3"
        >
          <div class="text-sm font-medium text-zinc-300">
            {{ formatDateKey(day.dateKey) }}
          </div>
          <div class="text-xs text-zinc-400">
            Total:
            <span class="font-semibold text-zinc-200">{{
              formatAmount(day.total)
            }}</span>
          </div>
          <ul class="mt-2 space-y-0.5 text-xs">
            <li
              v-for="e in day.events"
              :key="e.id ?? e.at"
              class="flex items-center gap-2"
            >
              <span class="w-8">{{ formatTime(e.at) }}</span>
              <span>–</span>
              <span>{{ formatAmount(e.amount) }}</span>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                square
                :disabled="typeof e.id !== 'number' || loading"
                @click="onEditClick(e)"
                class="-ml-1"
              >
                <PenIcon />
              </UButton>
            </li>
          </ul>
        </div>
      </template>
    </UCarousel>

    <WaterEditRecordModal
      v-model:open="isModalOpen"
      :record="selectedRecord"
      :loading="loading"
      @save="onSaveEdit"
    />
  </div>
</template>
