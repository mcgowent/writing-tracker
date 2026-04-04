import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings } from '../types'

interface SettingsStore extends Settings {
  setDailyTarget: (target: number) => void
  setDefaultProject: (projectId: string) => void
  setTheme: (theme: Settings['theme']) => void
  setGoalType: (goalType: Settings['goalType']) => void
  setReminderEnabled: (enabled: boolean) => void
  setReminderTime: (time: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      dailyWordTarget: 1000,
      defaultProjectId: 'proj-1',
      theme: 'system',
      goalType: 'daily',
      reminderEnabled: false,
      reminderTime: '20:00',
      setDailyTarget: (dailyWordTarget) => set({ dailyWordTarget }),
      setDefaultProject: (defaultProjectId) => set({ defaultProjectId }),
      setTheme: (theme) => set({ theme }),
      setGoalType: (goalType) => set({ goalType }),
      setReminderEnabled: (reminderEnabled) => set({ reminderEnabled }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
    }),
    { name: 'writing-tracker-settings' },
  ),
)
