<script setup lang="ts">
const props = defineProps<{
  count: number
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
  <div>
    <UFieldGroup size="lg">
      <div class="min-w-0 flex-1">
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
        <div class="h-10 min-w-0 flex-1 rounded-md border border-gray-700/50" />
      </template>

      <UButton
        color="warning"
        variant="subtle"
        @click="onDrinkClick"
        icon="i-streamline-sharp-color:water-drop-flat"
        :ui="{ leadingIcon: 'size-4 shrink-0' }"
        >Drink</UButton
      >
    </UFieldGroup>
  </div>
</template>
