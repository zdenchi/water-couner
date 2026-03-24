<script setup lang="ts">
import { formatAmount, formatDateKey, formatTime } from '../utils/waterFormat'
import type { DayData, DrinkRecord } from '../types/water'

const props = defineProps<{
  days: DayData[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit-time', record: DrinkRecord, time: string): void
}>()

const isModalOpen = ref(false)
const selectedRecord = ref<DrinkRecord | null>(null)
const editableTime = ref('')

const toLocalTimeInput = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

const onEditClick = (record: DrinkRecord) => {
  selectedRecord.value = record
  editableTime.value = toLocalTimeInput(record.at)
  isModalOpen.value = true
}

const onSaveEdit = () => {
  if (!selectedRecord.value) return
  if (!/^\d{2}:\d{2}$/.test(editableTime.value)) return

  emit('edit-time', selectedRecord.value, editableTime.value)
  isModalOpen.value = false
}
</script>

<template>
  <div
    class="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-4 text-gray-100 shadow-lg"
  >
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="day in days"
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
              icon="i-lucide-pencil"
              :ui="{ leadingIcon: 'size-3' }"
              :disabled="typeof e.id !== 'number' || loading"
              @click="onEditClick(e)"
            />
          </li>
        </ul>
      </div>
    </div>

    <UModal
      v-model:open="isModalOpen"
      title="Изменить время"
      description="Выберите новое время приёма воды"
    >
      <template #body>
        <div class="flex items-center gap-2">
          <UInput
            v-model="editableTime"
            type="time"
            size="sm"
            class="w-36"
            :disabled="loading"
          />
          <UButton
            color="warning"
            variant="subtle"
            size="sm"
            :disabled="!editableTime || loading"
            @click="onSaveEdit"
            >Сохранить</UButton
          >
        </div>
      </template>
    </UModal>
  </div>
</template>
