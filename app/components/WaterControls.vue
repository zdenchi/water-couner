<script setup lang="ts">
const props = defineProps<{
  count: number
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:count', value: number): void
  (e: 'drink'): void
}>()

const onUpdateCount = (value: number | null) => {
  emit('update:count', value ?? props.count)
}

const onDrinkClick = () => {
  emit('drink')
}
</script>

<template>
  <div class="flex w-64 items-center gap-2">
    <UInputNumber
      aria-label="Amount in litres"
      size="lg"
      :model-value="count"
      @update:model-value="onUpdateCount"
      :min="0.5"
      :step="0.1"
      :increment="{
        color: 'neutral',
        variant: 'solid',
        size: 'sm',
      }"
      :decrement="{
        color: 'neutral',
        variant: 'solid',
        size: 'sm',
      }"
    />

    <UButton
      color="warning"
      variant="subtle"
      :loading="loading"
      :disabled="loading"
      size="lg"
      @click="onDrinkClick"
      ><span class="text-xs">💧</span> Drink</UButton
    >
  </div>
</template>
