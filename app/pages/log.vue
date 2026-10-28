<script setup lang="ts">
import { type TableColumn } from '@nuxt/ui'

type Visit = {
  ip: string
  path: string
  at: string
}

const { data, pending } = await useFetch<Visit[]>('/api/visits')

const visits = computed(() => [...(data.value ?? [])].reverse())

const columns: TableColumn<Visit>[] = [
  {
    accessorKey: 'at',
    header: 'Time',
    meta: {
      class: {
        th: 'w-px',
        td: 'w-px tabular-nums text-highlighted',
      },
    },
  },
  {
    accessorKey: 'ip',
    header: 'IP',
    meta: {
      class: {
        th: 'w-px',
        td: 'w-px font-mono text-xs',
      },
    },
  },
  {
    accessorKey: 'path',
    header: 'Page',
    meta: {
      class: {
        td: 'font-mono text-xs text-highlighted',
      },
    },
  },
]

function formatTime(value: string) {
  return new Date(value).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
</script>

<template>
  <div class="dark min-h-dvh bg-zinc-900 px-4 py-5">
    <div class="mx-auto w-max max-w-full">
      <div class="mb-2 flex items-center justify-between gap-4 px-0.5">
        <h1 class="text-sm font-medium text-highlighted">Visits</h1>
        <UBadge color="neutral" variant="subtle" size="sm">
          {{ visits.length }}
        </UBadge>
      </div>

      <UTable
        :data="visits"
        :columns="columns"
        :loading="pending"
        sticky
        empty="No visits yet"
        :ui="{
          root: 'max-h-[calc(100dvh-4.5rem)] rounded-lg ring ring-default',
          th: 'px-2.5 py-1.5 text-xs',
          td: 'px-2.5 py-1 text-sm',
          tr: 'hover:bg-elevated/50',
        }"
      >
        <template #at-cell="{ row }">
          {{ formatTime(row.original.at) }}
        </template>
      </UTable>
    </div>
  </div>
</template>
