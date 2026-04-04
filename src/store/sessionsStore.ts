import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import type { Session } from '../types'
import { MOCK_SESSIONS } from '../data/mockData'
import { generateId } from '../lib/utils'
import { upsertRemoteSession, deleteRemoteSession } from '../lib/syncData'

interface NewSession {
  projectId: string
  date: string
  wordCount: number
  duration?: number
  notes?: string
}

interface SessionsStore {
  sessions: Session[]
  addSession: (data: NewSession) => void
  updateSession: (id: string, updates: Partial<Omit<Session, 'id' | 'createdAt'>>) => void
  deleteSession: (id: string) => void
  /** Bulk replace — used when loading remote data after sign-in */
  setAllSessions: (sessions: Session[]) => void
}

export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set) => ({
      sessions: MOCK_SESSIONS,

      addSession: (data) => {
        const session: Session = {
          ...data,
          id: generateId(),
          createdAt: format(new Date(), 'yyyy-MM-dd'),
        }
        set((state) => ({ sessions: [...state.sessions, session] }))
        // Sync to Supabase (fire and forget)
        import('../store/authStore').then(({ useAuthStore }) => {
          const user = useAuthStore.getState().user
          if (user) upsertRemoteSession(session, user.id)
        })
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }))
        // Re-sync updated session
        import('../store/authStore').then(({ useAuthStore }) => {
          const user = useAuthStore.getState().user
          if (!user) return
          const updated = useSessionsStore.getState().sessions.find(s => s.id === id)
          if (updated) upsertRemoteSession(updated, user.id)
        })
      },

      deleteSession: (id) => {
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) }))
        deleteRemoteSession(id)
      },

      setAllSessions: (sessions) => set({ sessions }),
    }),
    { name: 'writing-tracker-sessions' },
  ),
)
