import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ProgressRing } from './ProgressRing'
import { LogSessionSheet } from './LogSessionSheet'
import { Timer } from './Timer'
import { StatCard } from '../../components/StatCard'
import { StreakBadge } from '../../components/StreakBadge'
import { useTodayStats } from '../../hooks/useTodayStats'
import { useStreak } from '../../hooks/useStreak'
import { formatNumber } from '../../lib/utils'

export const TodayScreen = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const {
    todayTotal,
    weekTotal,
    allTimeTotal,
    progress,
    ringTotal,
    ringTarget,
    goalType,
  } = useTodayStats()
  const streak = useStreak()
  const remaining = ringTarget - ringTotal

  return (
    <div className="flex flex-col items-center gap-5 pt-8 pb-24 px-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Today</h1>
        <StreakBadge count={streak} />
      </div>

      {/* Progress ring */}
      <ProgressRing
        progress={progress}
        currentTotal={ringTotal}
        targetTotal={ringTarget}
        goalLabel={goalType === 'weekly' ? 'this week' : 'today'}
        size={200}
      />

      {/* Stat cards */}
      <div className="w-full grid grid-cols-2 gap-3">
        {goalType === 'weekly' ? (
          <>
            <StatCard label="Today"    value={formatNumber(todayTotal)}   sub="words written" />
            <StatCard label="All Time" value={formatNumber(allTimeTotal)} sub="words written" />
          </>
        ) : (
          <>
            <StatCard label="This Week" value={formatNumber(weekTotal)}    sub="words written" />
            <StatCard label="All Time"  value={formatNumber(allTimeTotal)} sub="words written" />
          </>
        )}
      </div>

      {/* Timer widget */}
      <div className="w-full">
        <Timer />
      </div>

      {/* Motivational nudge */}
      {ringTotal === 0 && (
        <p className="text-slate-500 text-sm text-center">Ready to write? Start the timer or log a session.</p>
      )}
      {ringTotal > 0 && remaining > 0 && (
        <p className="text-slate-500 text-sm text-center">
          {formatNumber(remaining)} words to reach your {goalType === 'weekly' ? 'weekly' : 'daily'} goal.
        </p>
      )}

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-violet-900/50 transition-colors z-30"
        aria-label="Log writing session"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <LogSessionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
