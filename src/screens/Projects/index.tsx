import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useProjectsStore } from '../../store/projectsStore'
import { useSessionsStore } from '../../store/sessionsStore'
import { getProjectTotals } from '../../lib/derived'
import { ProjectCard } from './ProjectCard'
import { AddProjectSheet } from './AddProjectSheet'
import { formatNumber } from '../../lib/utils'

export const ProjectsScreen = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const projects = useProjectsStore((s) => s.projects)
  const deleteProject = useProjectsStore((s) => s.deleteProject)
  const sessions = useSessionsStore((s) => s.sessions)

  const totals = useMemo(() => getProjectTotals(sessions), [sessions])

  const sessionCounts = useMemo(() => {
    const map = new Map<string, number>()
    sessions.forEach((s) => {
      map.set(s.projectId, (map.get(s.projectId) ?? 0) + 1)
    })
    return map
  }, [sessions])

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => (totals.get(b.id) ?? 0) - (totals.get(a.id) ?? 0)),
    [projects, totals],
  )

  const totalAllWords = useMemo(
    () => [...totals.values()].reduce((sum, v) => sum + v, 0),
    [totals],
  )

  return (
    <div className="px-4 pt-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-slate-100">Projects</h1>
        <span className="text-xs text-slate-500 tabular-nums">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-6">
        {formatNumber(totalAllWords)} words across all projects
      </p>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-48 text-slate-500 gap-2">
          <p className="text-lg font-medium text-slate-400">No projects yet</p>
          <p className="text-sm text-center">Tap the + button to create your first project.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              totalWords={totals.get(project.id) ?? 0}
              sessionCount={sessionCounts.get(project.id) ?? 0}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-violet-900/50 transition-colors z-30"
        aria-label="Add project"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <AddProjectSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
