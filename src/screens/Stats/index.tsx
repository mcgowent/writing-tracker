import { useMemo, useState } from 'react'
import { useSessionsStore } from '../../store/sessionsStore'
import { useProjectsStore } from '../../store/projectsStore'
import { useTodayStats } from '../../hooks/useTodayStats'
import { useStreak } from '../../hooks/useStreak'
import { StatCard } from '../../components/StatCard'
import { StreakBadge } from '../../components/StreakBadge'
import { Heatmap } from './Heatmap'
import { WeeklyChart } from './WeeklyChart'
import { TrendsChart } from './TrendsChart'
import { BestDaysChart } from './BestDaysChart'
import { getProjectTotals } from '../../lib/derived'
import { formatNumber } from '../../lib/utils'

const TREND_OPTIONS = [
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
  { label: '90d', days: 90 },
]

export const StatsScreen = () => {
  const [trendDays, setTrendDays] = useState(30)
  const { todayTotal, weekTotal, allTimeTotal, dailyWordTarget, today } = useTodayStats()
  const streak = useStreak()
  const sessions = useSessionsStore((s) => s.sessions)
  const projects = useProjectsStore((s) => s.projects)

  const projectTotals = useMemo(() => {
    const totals = getProjectTotals(sessions)
    return projects
      .map(p => ({ project: p, total: totals.get(p.id) ?? 0 }))
      .filter(x => x.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [sessions, projects])

  const bestSession = useMemo(
    () => sessions.length > 0
      ? sessions.reduce((best, s) => (s.wordCount > best.wordCount ? s : best))
      : null,
    [sessions],
  )

  const avgWords = useMemo(() => {
    const days = new Set(sessions.map(s => s.date)).size
    return days > 0 ? Math.round(allTimeTotal / days) : 0
  }, [sessions, allTimeTotal])

  const avgDuration = useMemo(() => {
    const timed = sessions.filter(s => s.duration)
    return timed.length > 0
      ? Math.round(timed.reduce((sum, s) => sum + (s.duration ?? 0), 0) / timed.length)
      : 0
  }, [sessions])

  return (
    <div className="px-4 pt-8 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Stats</h1>
        <StreakBadge count={streak} />
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Today"         value={formatNumber(todayTotal)}   sub="words" accent />
        <StatCard label="This Week"     value={formatNumber(weekTotal)}    sub="words" />
        <StatCard label="All Time"      value={formatNumber(allTimeTotal)} sub="words" />
        <StatCard label="Avg / Day"     value={formatNumber(avgWords)}     sub="words" />
        <StatCard label="Sessions"      value={sessions.length}            sub="logged" />
        {bestSession ? (
          <StatCard label="Best Session" value={formatNumber(bestSession.wordCount)} sub="words in one go" />
        ) : (
          <StatCard label="Avg Duration" value={avgDuration > 0 ? `${avgDuration}m` : '—'} sub="per session" />
        )}
      </div>

      {/* Words over time — area chart */}
      <div className="bg-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Words Over Time
          </p>
          <div className="flex gap-1">
            {TREND_OPTIONS.map(({ label, days }) => (
              <button
                key={days}
                onClick={() => setTrendDays(days)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  trendDays === days
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <TrendsChart sessions={sessions} today={today} target={dailyWordTarget} days={trendDays} />
        <p className="text-xs text-slate-600 mt-2">Dashed line = daily goal</p>
      </div>

      {/* 14-day bar chart */}
      <div className="bg-slate-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Last 14 Days
        </p>
        <WeeklyChart sessions={sessions} today={today} target={dailyWordTarget} />
        <p className="text-xs text-slate-600 mt-2">Green = goal met · Dashed = daily goal</p>
      </div>

      {/* Best days of the week */}
      <div className="bg-slate-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Best Day of the Week
        </p>
        <p className="text-xs text-slate-600 mb-3">Average words written per weekday</p>
        <BestDaysChart sessions={sessions} />
      </div>

      {/* 16-week heatmap */}
      <div className="bg-slate-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          16-Week Heatmap
        </p>
        <Heatmap sessions={sessions} today={today} />
      </div>

      {/* Per-project breakdown */}
      {projectTotals.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            By Project
          </p>
          <div className="flex flex-col gap-2">
            {projectTotals.map(({ project, total }) => {
              const pct = allTimeTotal > 0 ? (total / allTimeTotal) * 100 : 0
              return (
                <div key={project.id} className="bg-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                      <span className="text-sm font-medium text-slate-200 truncate">{project.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-100 tabular-nums ml-2 flex-shrink-0">
                      {formatNumber(total)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: project.color }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{pct.toFixed(1)}% of all words</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
