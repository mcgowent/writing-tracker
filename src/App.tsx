import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { TodayScreen } from './screens/Today'
import { HistoryScreen } from './screens/History'
import { StatsScreen } from './screens/Stats'
import { ProjectsScreen } from './screens/Projects'
import { SettingsScreen } from './screens/Settings'
import { AuthScreen } from './screens/Auth'
import { useAuthStore } from './store/authStore'
import { useSettingsStore } from './store/settingsStore'
import { useSessionsStore } from './store/sessionsStore'
import { getTodayTotal } from './lib/derived'
import { todayStr } from './lib/utils'
import { hasSupabase } from './lib/supabase'

function useReminderCheck() {
  const reminderEnabled = useSettingsStore(s => s.reminderEnabled)
  const reminderTime = useSettingsStore(s => s.reminderTime)
  const sessions = useSessionsStore(s => s.sessions)

  useEffect(() => {
    if (!reminderEnabled || Notification.permission !== 'granted') return

    const check = () => {
      const now = new Date()
      const [h, m] = reminderTime.split(':').map(Number)
      const isAfterReminder = now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)
      const wordsToday = getTodayTotal(sessions, todayStr())
      if (isAfterReminder && wordsToday === 0) {
        new Notification('Time to write! ✍️', {
          body: "You haven't logged any words today. Keep your streak alive!",
          icon: '/icon-192.png',
          tag: 'daily-reminder',   // prevents duplicate notifications
        })
      }
    }

    check() // check immediately on mount
    const id = setInterval(check, 60_000) // re-check every minute
    return () => clearInterval(id)
  }, [reminderEnabled, reminderTime, sessions])
}

function AppContent() {
  const { initialized, init } = useAuthStore()

  useEffect(() => { init() }, [init])
  useReminderCheck()

  // Show nothing until auth state is restored (avoids flash)
  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 max-w-lg mx-auto relative">
      <Routes>
        {hasSupabase && <Route path="/auth" element={<AuthScreen />} />}
        <Route path="/"          element={<TodayScreen />} />
        <Route path="/history"   element={<HistoryScreen />} />
        <Route path="/stats"     element={<StatsScreen />} />
        <Route path="/projects"  element={<ProjectsScreen />} />
        <Route path="/settings"  element={<SettingsScreen />} />
      </Routes>
      {/* Hide nav on auth screen */}
      <Routes>
        <Route path="/auth" element={null} />
        <Route path="*"     element={<BottomNav />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  )
}
