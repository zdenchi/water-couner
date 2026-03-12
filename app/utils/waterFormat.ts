import { format, parseISO } from 'date-fns'

export function formatAmount(value: number) {
  return value.toFixed(2)
}

export function formatDateKey(dateKey: string) {
  return format(parseISO(dateKey), 'dd-MM-yyyy')
}

export function formatTime(iso: string) {
  return format(parseISO(iso), 'HH:mm')
}
