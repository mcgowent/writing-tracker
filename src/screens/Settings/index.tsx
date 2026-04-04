import { useSettingsStore } from '../../store/settingsStore'
import { useProjectsStore } from '../../store/projectsStore'
import { useSessionsStore } from '../../store/sessionsStore'
import { useAuthStore } from '../../store/authStore'
import { hasSupabase } from '../../lib/supabase'
import { formatNumber } from '../../lib/utils'
import type { GoalType } from '../../types'

const GOAL_PRESETS = [250, 500, 750, 1000, 1500, 2000]

const GOAL_TYPES: { value: GoalType; label: string; desc: string }[] = [
  { value: 'daily',  label: 'Daily',  desc: 'Track words written today' },
  { value: 'weekly', label: 'Weekly', desc: 'Track words written this week' },
]

export const SettingsScreen = () => {
  const {
    dailyWordTarget, defaultProjectId, goalType,
    reminderEnabled, reminderTime,
    setDailyTarget, setDefaultProject, setGoalType,
    setReminderEnabled, setReminderTime,
  } = useSettingsStore()
  const projects = useProjectsStore((s) => s.projects)
  const sessions = useSessionsStore((s) => s.sessions)
  const { user, signOut } = useAuthStore()

  const handleToggleReminder = async (enabled: boolean) => {
    if (enabled) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
    }
    setReminderEnabled(enabled)
  }

  const handleExportCSV = () => {
    const projectMap = new Map(projects.map((p) => [p.id, p.name]))
    const header = 'id,date,project,wordCount,duration,notes'
    const rows = sessions.map((s) =>
      [
        s.id, s.date,
        `"${projectMap.get(s.projectId) ?? s.projectId}"`,
        s.wordCount,
        s.duration ?? '',
        `"${(s.notes ?? '').replace(/"/g, '""')}"`,
      ].join(','),
    )
    triggerDownload(
      new Blob([[header, ...rows].join('\n')], { type: 'text/csv' }),
      'writing-tracker-sessions.csv',
    )
  }

  const handleExportJSON = () => {
    triggerDownload(
      new Blob([JSON.stringify({ projects, sessions, exportedAt: new Date().toISOString() }, null, 2)], {
        type: 'application/json',
      }),
      'writing-tracker-data.json',
    )
  }

  return (
    <div className="px-4 pt-8 pb-24 space-y-4">
      <h1 className="text-xl font-bold text-slate-100 mb-6">Settings</h1>

      {/* Account — only shown when Supabase is configured */}
      {hasSupabase && (
        <div className="bg-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Account</p>
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user.email}</p>
                <p className="text-xs text-slate-500 mt-0.5">Synced to cloud</p>
              </div>
              <button
                onClick={signOut}
                className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-xl px-4 py-2 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-300">Guest mode</p>
                <p className="text-xs text-slate-500 mt-0.5">Data saved locally only</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goal type */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Goal Type</p>
        <div className="flex flex-col gap-2">
          {GOAL_TYPES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setGoalType(value)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                goalType === value
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                goalType === value ? 'border-violet-400 bg-violet-400' : 'border-slate-500'
              }`} />
              <div>
                <p className={`text-sm font-semibold ${goalType === value ? 'text-violet-300' : 'text-slate-200'}`}>
                  {label}
                </p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily word goal */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {goalType === 'weekly' ? 'Weekly' : 'Daily'} Word Goal
        </p>
        <p className="text-2xl font-bold text-slate-100 tabular-nums mb-1">
          {goalType === 'weekly' ? formatNumber(dailyWordTarget * 7) : formatNumber(dailyWordTarget)}
          <span className="text-sm font-normal text-slate-500 ml-1.5">
            words / {goalType === 'weekly' ? 'week' : 'day'}
          </span>
        </p>
        {goalType === 'weekly' && (
          <p className="text-xs text-slate-600 mb-2">Based on {formatNumber(dailyWordTarget)} words/day × 7</p>
        )}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {GOAL_PRESETS.map((target) => (
            <button
              key={target}
              onClick={() => setDailyTarget(target)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                dailyWordTarget === target
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {target >= 1000 ? `${target / 1000}k` : target}
            </button>
          ))}
        </div>
      </div>

      {/* Default project */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <label
          htmlFor="default-project"
          className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3"
        >
          Default Project
        </label>
        <select
          id="default-project"
          value={defaultProjectId}
          onChange={(e) => setDefaultProject(e.target.value)}
          className="w-full bg-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Daily reminder */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Reminder</p>
            <p className="text-xs text-slate-500 mt-0.5">Notify you to write each day</p>
          </div>
          <button
            onClick={() => handleToggleReminder(!reminderEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              reminderEnabled ? 'bg-violet-600' : 'bg-slate-700'
            }`}
            aria-label="Toggle reminder"
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              reminderEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        {reminderEnabled && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Reminder Time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm border border-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Export */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Export Data</p>
        <p className="text-xs text-slate-500 mb-4">
          {sessions.length} sessions · {projects.length} projects
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">About</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Version</span>
            <span className="text-sm text-slate-300">0.3.0 — Phase 3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Storage</span>
            <span className="text-sm text-slate-300">{user ? 'Supabase + local' : 'Local only'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
