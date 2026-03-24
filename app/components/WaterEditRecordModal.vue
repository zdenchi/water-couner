<script setup lang="ts">
import type { DrinkRecord } from '../types/water'

const props = defineProps<{
  open: boolean
  loading?: boolean
  record: DrinkRecord | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', time: string, amount: number): void
}>()

const editableTime = ref('')
const editableAmount = ref<number>(1)

const toLocalTimeInput = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

watch(
  () => props.record,
  (record) => {
    if (!record) return
    editableTime.value = toLocalTimeInput(record.at)
    editableAmount.value = record.amount
  },
  { immediate: true },
)

const onSaveEdit = () => {
  if (!/^\d{2}:\d{2}$/.test(editableTime.value)) return
  if (Number.isNaN(editableAmount.value) || editableAmount.value <= 0) return

  emit('save', editableTime.value, editableAmount.value)
}
</script>

<template>
  <UModal
    :open="open"
    title="Изменить запись"
    description="Изменить время или количество воды"
    @update:open="emit('update:open', $event)"
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
        <UInputNumber
          v-model="editableAmount"
          size="sm"
          class="w-28"
          :disabled="loading"
          :min="0.1"
          :max="10"
          :step="0.1"
        />
        <UButton
          color="warning"
          variant="subtle"
          size="sm"
          :disabled="!editableTime || loading || editableAmount <= 0"
          @click="onSaveEdit"
          >Сохранить</UButton
        >
      </div>
    </template>
  </UModal>
</template>
