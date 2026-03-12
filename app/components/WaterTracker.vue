<script setup lang="ts">
const count = ref(1.5)
const total = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)

const DB_NAME = 'water'
const DB_VERSION = 2
const STORE_NAME = 'drinks'

type DrinkRecord = { id?: number; at: string; amount: number }

type DayData = { dateKey: string; total: number; events: DrinkRecord[] }

type Totals = {
  today: number
  currentMonth: number
  lastMonth: number
  allTime: number
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!import.meta.client || !('indexedDB' in window)) {
      reject(new Error('IndexedDB недоступен'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      reject(request.error ?? new Error('Ошибка открытия IndexedDB'))
    }
  })
}

async function getAllDrinks(): Promise<DrinkRecord[]> {
  const db = await openDb()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result as DrinkRecord[])
    request.onerror = () => reject(request.error ?? new Error('Ошибка чтения'))
  })
}

function todayDrinks(records: DrinkRecord[]) {
  const today = getTodayKey()
  return records.filter((r) => r.at.startsWith(today))
}

async function addDrink(amount: number): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const record: DrinkRecord = { at: new Date().toISOString(), amount }
    const request = store.add(record)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error('Ошибка записи'))
  })
}

function calcTotals(records: DrinkRecord[]): Totals {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

  const currentMonthKey = `${year}-${pad(month + 1)}`

  const lastMonthDate = new Date(year, month - 1, 1)
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${pad(
    lastMonthDate.getMonth() + 1,
  )}`

  let todayTotal = 0
  let currentMonthTotal = 0
  let lastMonthTotal = 0
  let allTimeTotal = 0

  const todayKey = getTodayKey()

  for (const r of records) {
    const dayKey = r.at.slice(0, 10)
    const monthKey = r.at.slice(0, 7)

    allTimeTotal += r.amount

    if (dayKey === todayKey) {
      todayTotal += r.amount
    }

    if (monthKey === currentMonthKey) {
      currentMonthTotal += r.amount
    } else if (monthKey === lastMonthKey) {
      lastMonthTotal += r.amount
    }
  }

  return {
    today: todayTotal,
    currentMonth: currentMonthTotal,
    lastMonth: lastMonthTotal,
    allTime: allTimeTotal,
  }
}

function lastThreeDaysFromRecords(records: DrinkRecord[]): DayData[] {
  const byDay = new Map<string, DrinkRecord[]>()
  for (const r of records) {
    const key = r.at.slice(0, 10)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key)!.push(r)
  }
  const sortedKeys = [...byDay.keys()].sort().reverse().slice(0, 3)
  return sortedKeys.reverse().map((dateKey) => {
    const events = (byDay.get(dateKey) ?? []).sort(
      (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
    )
    const total = events.reduce((sum, r) => sum + r.amount, 0)
    return { dateKey, total, events }
  })
}

async function refreshData() {
  const all = await getAllDrinks()
  const today = todayDrinks(all)
  drinksToday.value = today
  total.value = today.reduce((sum, r) => sum + r.amount, 0)
  lastThreeDays.value = lastThreeDaysFromRecords(all)
  totals.value = calcTotals(all)
}

const drinksToday = ref<DrinkRecord[]>([])
const lastThreeDays = ref<DayData[]>([])
const totals = ref<Totals | null>(null)

async function drink() {
  if (!import.meta.client) return

  try {
    loading.value = true
    const amount = Number(count.value)
    await addDrink(amount)
    await refreshData()
    error.value = null
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось сохранить данные'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!import.meta.client) return

  try {
    loading.value = true
    await refreshData()
    error.value = null
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось загрузить данные'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <WaterControls v-model:count="count" @drink="drink" />

      <WaterTodaySummary :total="total" :loading="loading" :error="error" />
    </div>

    <WaterTotalsCard v-if="totals" :totals="totals" />

    <WaterHistoryCard v-if="lastThreeDays.length" :days="lastThreeDays" />
  </div>
</template>

