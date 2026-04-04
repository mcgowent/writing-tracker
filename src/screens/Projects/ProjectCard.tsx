import { Trash2 } from 'lucide-react'
import type { Project } from '../../types'
import { formatNumber } from '../../lib/utils'

interface ProjectCardProps {
  project: Project
  totalWords: number
  sessionCount: number
  onDelete: (id: string) => void
}

export const ProjectCard = ({
  project,
  totalWords,
  sessionCount,
  onDelete,
}: ProjectCardProps) => (
  <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4">
    {/* Color swatch */}
    <div
      className="w-10 h-10 rounded-xl flex-shrink-0"
      style={{ backgroundColor: project.color + '33' }}
    >
      <div
        className="w-full h-full rounded-xl flex items-center justify-center"
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: project.color }}
        />
      </div>
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-100 truncate">{project.name}</p>
      <p className="text-xs text-slate-500 mt-0.5">
        {formatNumber(totalWords)} words · {sessionCount} session{sessionCount !== 1 ? 's' : ''}
      </p>
    </div>

    {/* Delete */}
    <button
      onClick={() => onDelete(project.id)}
      className="text-slate-600 hover:text-red-400 transition-colors p-1.5 flex-shrink-0"
      aria-label={`Delete ${project.name}`}
    >
      <Trash2 size={15} />
    </button>
  </div>
)
