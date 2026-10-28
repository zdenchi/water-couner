<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type Visit = {
  ip: string
  path: string
  at: string
}

const { data, pending, refresh } = await useFetch<Visit[]>('/api/visits')

const visits = computed(() => [...(data.value ?? [])].reverse())
const initialLoading = computed(() => pending.value && !data.value)

useIntervalFn(() => {
  void refresh()
}, 2000)

const columns: TableColumn<Visit>[] = [
  {
    accessorKey: 'at',
    header: 'Time',
    meta: {
      class: {
        th: 'w-px',
        td: 'w-px tabular-nums text-zinc-200',
      },
    },
  },
  {
    accessorKey: 'ip',
    header: 'IP',
    meta: {
      class: {
        th: 'w-px',
        td: 'w-px font-mono text-xs text-zinc-400',
      },
    },
  },
  {
    accessorKey: 'path',
    header: 'Page',
    meta: {
      class: {
        td: 'font-mono text-xs text-zinc-200',
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
  <div class="h-dvh max-h-dvh overflow-auto bg-zinc-800 p-4">
    <div class="inline-block">
      <div class="mb-2 flex items-center justify-between gap-4">
        <h1 class="text-sm font-medium text-zinc-200">Visits</h1>
        <UBadge color="neutral" variant="subtle" size="sm">
          {{ visits.length }}
        </UBadge>
      </div>

      <UTable
        :data="visits"
        :columns="columns"
        :loading="initialLoading"
        sticky
        empty="No visits yet"
        :ui="{
          root: 'inline-block max-h-[calc(100dvh-4.5rem)] rounded-lg border border-zinc-700/50 bg-zinc-900/80',
          base: 'min-w-max',
          thead: 'bg-zinc-800',
          th: 'bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400',
          td: 'px-2.5 py-1 text-sm text-zinc-300',
          tr: 'hover:bg-zinc-800/50',
        }"
      >
        <template #at-cell="{ row }">
          {{ formatTime(row.original.at) }}
        </template>
      </UTable>
    </div>
  </div>
</template>
