import { useMemo } from 'react'
import { useSessionsStore } from '../store/sessionsStore'
import { useSettingsStore } from '../store/settingsStore'
import { getTodayTotal, getWeekTotal, getAllTimeTotal } from '../lib/derived'
import { todayStr } from '../lib/utils'

export const useTodayStats = () => {
  const sessions = useSessionsStore((s) => s.sessions)
  const dailyWordTarget = useSettingsStore((s) => s.dailyWordTarget)
  const goalType = useSettingsStore((s) => s.goalType)
  const today = todayStr()

  return useMemo(() => {
    const todayTotal = getTodayTotal(sessions, today)
    const weekTotal = getWeekTotal(sessions, today)
    const allTimeTotal = getAllTimeTotal(sessions)

    // Ring values change based on goal type
    const ringTotal = goalType === 'weekly' ? weekTotal : todayTotal
    const ringTarget = goalType === 'weekly' ? dailyWordTarget * 7 : dailyWordTarget
    const progress = Math.min(ringTotal / ringTarget, 1)
    const isGoalMet = ringTotal >= ringTarget

    return {
      todayTotal,
      weekTotal,
      allTimeTotal,
      progress,
      isGoalMet,
      dailyWordTarget,
      ringTotal,
      ringTarget,
      goalType,
      today,
    }
  }, [sessions, dailyWordTarget, goalType, today])
}
