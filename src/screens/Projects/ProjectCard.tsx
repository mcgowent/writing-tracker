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
}: ProjectCardProps) => {
  const hasTarget = project.targetWords && project.targetWords > 0
  const pct = hasTarget ? Math.min((totalWords / project.targetWords!) * 100, 100) : 0
  const isComplete = hasTarget && totalWords >= project.targetWords!
  const remaining = hasTarget ? Math.max(project.targetWords! - totalWords, 0) : 0

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <div className="flex items-center gap-4">
        {/* Color swatch */}
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: project.color + '33' }}
        >
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
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

      {/* Finish-line progress bar */}
      {hasTarget && (
        <div className="mt-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs text-slate-500">
              {isComplete ? (
                <span className="text-green-400 font-medium">Complete!</span>
              ) : (
                <>{formatNumber(remaining)} words remaining</>
              )}
            </span>
            <span className="text-xs tabular-nums" style={{ color: project.color }}>
              {pct.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                backgroundColor: isComplete ? '#22c55e' : project.color,
              }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            of {formatNumber(project.targetWords!)} word target
          </p>
        </div>
      )}
    </div>
  )
}
