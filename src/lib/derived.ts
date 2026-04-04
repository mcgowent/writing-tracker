import { parseISO, differenceInCalendarDays, subDays, addDays, format, isAfter } from 'date-fns'
import type { Session } from '../types'

export const getTodayTotal = (sessions: Session[], date: string): number =>
  sessions
    .filter(s => s.date === date)
    .reduce((sum, s) => sum + s.wordCount, 0)

export const getWeekTotal = (sessions: Session[], date: string): number => {
  const anchor = parseISO(date)
  return sessions
    .filter(s => {
      const diff = differenceInCalendarDays(anchor, parseISO(s.date))
      return diff >= 0 && diff < 7
    })
    .reduce((sum, s) => sum + s.wordCount, 0)
}

export const getAllTimeTotal = (sessions: Session[]): number =>
  sessions.reduce((sum, s) => sum + s.wordCount, 0)

export const getStreak = (sessions: Session[], todayDate: string): number => {
  const writtenDays = new Set(sessions.map(s => s.date))
  let streak = 0
  let cursor = parseISO(todayDate)
  while (writtenDays.has(format(cursor, 'yyyy-MM-dd'))) {
    streak++
    cursor = subDays(cursor, 1)
  }
  return streak
}

export const getSessionsSortedByDate = (sessions: Session[]): Session[] =>
  [...sessions].sort((a, b) => b.date.localeCompare(a.date))

/** Returns last 14 days of totals for the bar chart, oldest → newest. */
export const getLast14DaysTotals = (sessions: Session[], today: string) => {
  const wordsByDate = new Map<string, number>()
  sessions.forEach(s => {
    wordsByDate.set(s.date, (wordsByDate.get(s.date) ?? 0) + s.wordCount)
  })
  const todayDate = parseISO(today)
  return Array.from({ length: 14 }, (_, i) => {
    const date = subDays(todayDate, 13 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      date: dateStr,
      label: format(date, 'EEE'),
      words: wordsByDate.get(dateStr) ?? 0,
      isToday: dateStr === today,
    }
  })
}

const WEEKS = 16

export const getHeatmapGrid = (sessions: Session[], today: string) => {
  const wordsByDate = new Map<string, number>()
  sessions.forEach(s => {
    wordsByDate.set(s.date, (wordsByDate.get(s.date) ?? 0) + s.wordCount)
  })

  const todayDate = parseISO(today)
  const gridStart = subDays(todayDate, todayDate.getDay() + (WEEKS - 1) * 7)

  const weekColumns: { dateStr: string; count: number; isFuture: boolean }[][] = []
  const seenMonths = new Set<string>()
  const monthLabels: { colIndex: number; label: string }[] = []

  for (let col = 0; col < WEEKS; col++) {
    const week = []
    for (let row = 0; row < 7; row++) {
      const date = addDays(gridStart, col * 7 + row)
      const dateStr = format(date, 'yyyy-MM-dd')
      const isFuture = isAfter(date, todayDate)
      week.push({ dateStr, count: wordsByDate.get(dateStr) ?? 0, isFuture })

      if (row === 0) {
        const monthKey = format(date, 'M/yyyy')
        if (!seenMonths.has(monthKey)) {
          seenMonths.add(monthKey)
          monthLabels.push({ colIndex: col, label: format(date, 'MMM') })
        }
      }
    }
    weekColumns.push(week)
  }

  return { weekColumns, monthLabels }
}

export const getProjectTotals = (sessions: Session[]): Map<string, number> => {
  const map = new Map<string, number>()
  sessions.forEach(s => {
    map.set(s.projectId, (map.get(s.projectId) ?? 0) + s.wordCount)
  })
  return map
}

/** Daily word counts for the last `days` days, oldest → newest. */
export const getWordsOverTime = (sessions: Session[], days: number, today: string) => {
  const wordsByDate = new Map<string, number>()
  sessions.forEach(s => {
    wordsByDate.set(s.date, (wordsByDate.get(s.date) ?? 0) + s.wordCount)
  })
  const todayDate = parseISO(today)
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(todayDate, days - 1 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      date: dateStr,
      label: format(date, 'MMM d'),
      shortLabel: format(date, 'd'),
      words: wordsByDate.get(dateStr) ?? 0,
    }
  })
}

/** Average words written per day-of-week (0 = Sun … 6 = Sat). */
export const getBestDayOfWeek = (sessions: Session[]) => {
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  // Aggregate to one entry per (date, dayOfWeek) so multi-session days count once
  const dayMap = new Map<string, { dow: number; total: number }>()
  sessions.forEach(s => {
    const existing = dayMap.get(s.date)
    if (existing) {
      existing.total += s.wordCount
    } else {
      dayMap.set(s.date, { dow: parseISO(s.date).getDay(), total: s.wordCount })
    }
  })

  const totals = Array(7).fill(0)
  const counts = Array(7).fill(0)
  dayMap.forEach(({ dow, total }) => {
    totals[dow] += total
    counts[dow]++
  })

  return DAY_NAMES.map((day, i) => ({
    day,
    avg: counts[i] > 0 ? Math.round(totals[i] / counts[i]) : 0,
    sessions: counts[i],
  }))
}
