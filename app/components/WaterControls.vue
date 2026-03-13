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
  <div class="w-72">
    <UFieldGroup size="lg">
      <div class="">
        <UInputNumber
          aria-label="Amount in litres"
          :model-value="count"
          @update:model-value="onUpdateCount"
          :min="0.5"
          :max="5"
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
      </div>
      <template #fallback>
        <div
          class="h-10 w-16 min-w-0 flex-none rounded-md border border-gray-700/50"
        />
      </template>

      <UButton
        color="warning"
        variant="subtle"
        :loading="loading"
        :disabled="loading"
        @click="onDrinkClick"
        ><span class="text-xs">💧</span> Drink</UButton
      >
    </UFieldGroup>
  </div>
</template>
