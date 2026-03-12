import { computed, onMounted, ref, shallowRef } from 'vue'
import type { DayData, DrinkRecord, Totals } from '../types/water'
import { addDrink, getAllDrinks } from '../utils/waterStorage'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function processRecords(records: DrinkRecord[]) {
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
  const drinksToday: DrinkRecord[] = []
  const byDay = new Map<string, DrinkRecord[]>()

  for (const r of records) {
    const dayKey = r.at.slice(0, 10)
    const monthKey = r.at.slice(0, 7)

    allTimeTotal += r.amount

    if (dayKey === todayKey) {
      todayTotal += r.amount
      drinksToday.push(r)
    }

    if (monthKey === currentMonthKey) {
      currentMonthTotal += r.amount
    } else if (monthKey === lastMonthKey) {
      lastMonthTotal += r.amount
    }

    const dayEvents = byDay.get(dayKey)
    if (dayEvents) {
      dayEvents.push(r)
    } else {
      byDay.set(dayKey, [r])
    }
  }

  const totals: Totals = {
    today: todayTotal,
    currentMonth: currentMonthTotal,
    lastMonth: lastMonthTotal,
    allTime: allTimeTotal,
  }

  const sortedKeys = [...byDay.keys()].sort().reverse().slice(0, 3)
  const lastThreeDays = sortedKeys.reverse().map((dateKey) => {
    const events = (byDay.get(dateKey) ?? []).slice().sort(
      (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
    )
    const total = events.reduce((sum, r) => sum + r.amount, 0)
    return { dateKey, total, events }
  })

  return { drinksToday, lastThreeDays, totals }
}

export function useWaterTracker() {
  const drinksToday = shallowRef<DrinkRecord[]>([])
  const lastThreeDays = shallowRef<DayData[]>([])
  const totals = ref<Totals | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const total = computed(() =>
    drinksToday.value.reduce((sum, r) => sum + r.amount, 0),
  )

  async function refreshData() {
    const all = await getAllDrinks()
    const processed = processRecords(all)
    drinksToday.value = processed.drinksToday
    lastThreeDays.value = processed.lastThreeDays
    totals.value = processed.totals
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
