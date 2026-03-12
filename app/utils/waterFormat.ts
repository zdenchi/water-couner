export function formatAmount(value: number) {
  return value.toFixed(2)
}

export function formatDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-')
  if (!year || !month || !day) return dateKey
  return `${day}-${month}-${year}`
}

export function formatTime(iso: string) {
  if (iso.length < 16) return iso
  return iso.slice(11, 16)
}
