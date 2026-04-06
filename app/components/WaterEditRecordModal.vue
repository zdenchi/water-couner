<script setup lang="ts">
import type { DrinkRecord } from '../types/water'
import { Time } from '@internationalized/date'

const props = defineProps<{
  open: boolean
  loading?: boolean
  record: DrinkRecord | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', at: string, amount: number): void
}>()

const editableTime = shallowRef<Time | undefined>(undefined)
const editableAmount = ref<number>(1)

watch(
  () => props.record,
  (record) => {
    if (!record) return
    const date = new Date(record.at)
    editableTime.value = new Time(date.getHours(), date.getMinutes())
    editableAmount.value = record.amount
  },
  { immediate: true },
)

const onSaveEdit = () => {
  if (!props.record) return
  if (!editableTime.value) return
  if (Number.isNaN(editableAmount.value) || editableAmount.value <= 0) return

  const sourceDate = new Date(props.record.at)
  if (Number.isNaN(sourceDate.getTime())) return

  const nextDate = new Date(sourceDate)
  nextDate.setHours(editableTime.value.hour, editableTime.value.minute, 0, 0)

  emit('save', nextDate.toISOString(), editableAmount.value)
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
        <UInputTime
          v-model="editableTime"
          size="sm"
          :hour-cycle="24"
          class="w-auto"
          :disabled="loading"
        />
        <UInputNumber
          v-model="editableAmount"
          size="sm"
          class="w-24"
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
