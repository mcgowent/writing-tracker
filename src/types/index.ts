export interface Project {
  id: string
  name: string
  color: string
  targetWords?: number
  createdAt: string
}

export interface Session {
  id: string
  projectId: string
  date: string       // YYYY-MM-DD
  wordCount: number
  duration?: number  // minutes
  notes?: string
  createdAt: string
}

export type GoalType = 'daily' | 'weekly'

export interface Settings {
  dailyWordTarget: number
  defaultProjectId: string
  theme: 'light' | 'dark' | 'system'
  goalType: GoalType
  reminderEnabled: boolean
  reminderTime: string   // "HH:mm", e.g. "20:00"
}
