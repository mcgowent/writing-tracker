import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase, hasSupabase } from '../lib/supabase'
import { fetchRemoteSessions, fetchRemoteProjects } from '../lib/syncData'

interface AuthStore {
  user: User | null
  loading: boolean
  /** True once the initial session check has completed */
  initialized: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  /** Called once on app mount to restore an existing session */
  init: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  initialized: !hasSupabase, // if no Supabase, skip init entirely

  signIn: async (email, password) => {
    if (!supabase) return null
    set({ loading: true })
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    set({ loading: false })
    if (error) return error.message
    set({ user: data.user })
    await loadRemoteIntoStores(data.user.id)
    return null
  },

  signUp: async (email, password) => {
    if (!supabase) return null
    set({ loading: true })
    const { error, data } = await supabase.auth.signUp({ email, password })
    set({ loading: false })
    if (error) return error.message
    if (data.user) {
      set({ user: data.user })
      await loadRemoteIntoStores(data.user.id)
    }
    return null
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    set({ user: null })
    // Clear local data on sign out so next user starts fresh
    const { useSessionsStore } = await import('./sessionsStore')
    const { useProjectsStore } = await import('./projectsStore')
    useSessionsStore.getState().setAllSessions([])
    useProjectsStore.getState().setAllProjects([])
  },

  init: async () => {
    if (!supabase) { set({ initialized: true }); return }
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      set({ user: session.user })
      await loadRemoteIntoStores(session.user.id)
    }
    set({ initialized: true })

    // Keep auth state in sync with Supabase
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },
}))

async function loadRemoteIntoStores(userId: string) {
  const [sessions, projects] = await Promise.all([
    fetchRemoteSessions(userId),
    fetchRemoteProjects(userId),
  ])
  // Dynamic imports avoid circular dependency at module load time
  const { useSessionsStore } = await import('./sessionsStore')
  const { useProjectsStore } = await import('./projectsStore')
  if (sessions.length > 0) useSessionsStore.getState().setAllSessions(sessions)
  if (projects.length > 0) useProjectsStore.getState().setAllProjects(projects)
}
