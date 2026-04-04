import { format, parseISO, isToday, isYesterday } from 'date-fns'

export const todayStr = (): string => format(new Date(), 'yyyy-MM-dd')

export const formatDisplayDate = (dateStr: string): string => {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEE, MMM d')
}

export const formatNumber = (n: number): string => n.toLocaleString()

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
