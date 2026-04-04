import { useMemo } from 'react'
import { useSessionsStore } from '../../store/sessionsStore'
import { useProjectsStore } from '../../store/projectsStore'
import { SessionCard } from './SessionCard'
import { formatDisplayDate, formatNumber } from '../../lib/utils'
import type { Session } from '../../types'

export const HistoryScreen = () => {
  const sessions = useSessionsStore((s) => s.sessions)
  const deleteSession = useSessionsStore((s) => s.deleteSession)
  const projects = useProjectsStore((s) => s.projects)

  // Group by date, newest first
  const grouped = useMemo(() => {
    const map = new Map<string, Session[]>()
    ;[...sessions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((s) => {
        const arr = map.get(s.date) ?? []
        arr.push(s)
        map.set(s.date, arr)
      })
    return map
  }, [sessions])

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-slate-500 gap-2 px-4 pt-16">
        <p className="text-lg font-medium text-slate-400">No sessions yet</p>
        <p className="text-sm text-center">Log your first writing session from the Today tab.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-8 pb-24">
      <h1 className="text-xl font-bold text-slate-100 mb-6">History</h1>

      <div className="flex flex-col gap-7">
        {[...grouped.entries()].map(([date, dateSessions]) => {
          const dayTotal = dateSessions.reduce((sum, s) => sum + s.wordCount, 0)
          return (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  {formatDisplayDate(date)}
                </p>
                <p className="text-xs text-slate-600 tabular-nums">
                  {formatNumber(dayTotal)} words
                </p>
              </div>

              {/* Sessions for this date */}
              <div className="flex flex-col gap-2">
                {dateSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    project={projects.find((p) => p.id === session.projectId)}
                    onDelete={deleteSession}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
