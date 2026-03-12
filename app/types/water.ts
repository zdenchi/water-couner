export type DrinkRecord = { id?: number; at: string; amount: number }

export type DayData = {
  dateKey: string
  total: number
  events: DrinkRecord[]
}

export type Totals = {
  today: number
  currentMonth: number
  lastMonth: number
  allTime: number
}
