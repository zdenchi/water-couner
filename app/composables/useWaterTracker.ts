import { computed, onMounted, ref } from 'vue'
import type { DayData, DrinkRecord, Totals } from '../types/water'
import { addDrink, getAllDrinks } from '../utils/waterStorage'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function todayDrinks(records: DrinkRecord[]) {
  const today = getTodayKey()
  return records.filter((r) => r.at.startsWith(today))
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

export function useWaterTracker() {
  const drinksToday = ref<DrinkRecord[]>([])
  const lastThreeDays = ref<DayData[]>([])
  const totals = ref<Totals | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const total = computed(() =>
    drinksToday.value.reduce((sum, r) => sum + r.amount, 0),
  )

  async function refreshData() {
    const all = await getAllDrinks()
    drinksToday.value = todayDrinks(all)
    lastThreeDays.value = lastThreeDaysFromRecords(all)
    totals.value = calcTotals(all)
  }

  async function drink(amount: number) {
    if (!import.meta.client) return

    try {
      loading.value = true
      await addDrink(amount)
      await refreshData()
      error.value = null
    } catch (e) {
      console.error(e)
      error.value = 'Failed to save data'
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
      error.value = 'Failed to load data'
    } finally {
      loading.value = false
    }
  })

  return {
    total,
    totals,
    lastThreeDays,
    loading,
    error,
    drink,
  }
}
