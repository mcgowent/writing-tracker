import { useMemo } from 'react'
import { useSessionsStore } from '../store/sessionsStore'
import { getStreak } from '../lib/derived'
import { todayStr } from '../lib/utils'

export const useStreak = (): number => {
  const sessions = useSessionsStore((s) => s.sessions)
  const today = todayStr()
  return useMemo(() => getStreak(sessions, today), [sessions, today])
}
