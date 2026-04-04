import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import type { Project } from '../types'
import { MOCK_PROJECTS } from '../data/mockData'
import { generateId } from '../lib/utils'
import { upsertRemoteProject, deleteRemoteProject } from '../lib/syncData'

interface ProjectsStore {
  projects: Project[]
  addProject: (name: string, color: string, targetWords?: number) => void
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void
  deleteProject: (id: string) => void
  /** Bulk replace — used when loading remote data after sign-in */
  setAllProjects: (projects: Project[]) => void
}

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set) => ({
      projects: MOCK_PROJECTS,

      addProject: (name, color, targetWords) => {
        const project: Project = {
          id: generateId(),
          name,
          color,
          targetWords,
          createdAt: format(new Date(), 'yyyy-MM-dd'),
        }
        set((state) => ({ projects: [...state.projects, project] }))
        import('../store/authStore').then(({ useAuthStore }) => {
          const user = useAuthStore.getState().user
          if (user) upsertRemoteProject(project, user.id)
        })
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
        import('../store/authStore').then(({ useAuthStore }) => {
          const user = useAuthStore.getState().user
          if (!user) return
          const updated = useProjectsStore.getState().projects.find(p => p.id === id)
          if (updated) upsertRemoteProject(updated, user.id)
        })
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
        deleteRemoteProject(id)
      },

      setAllProjects: (projects) => set({ projects }),
    }),
    { name: 'writing-tracker-projects' },
  ),
)
