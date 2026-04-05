import { Trash2, Clock, Pencil } from 'lucide-react'
import type { Session, Project } from '../../types'
import { formatNumber } from '../../lib/utils'

interface SessionCardProps {
  session: Session
  project?: Project
  onDelete: (id: string) => void
  onEdit: (session: Session) => void
}

export const SessionCard = ({ session, project, onDelete, onEdit }: SessionCardProps) => (
  <div className="bg-slate-800 rounded-2xl p-4 flex items-start gap-3">
    {/* Project color indicator */}
    <div
      className="w-1.5 self-stretch rounded-full flex-shrink-0 mt-0.5"
      style={{ backgroundColor: project?.color ?? '#7c3aed' }}
    />

    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100 tabular-nums">
            {formatNumber(session.wordCount)} words
          </p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {project?.name ?? 'Unknown project'}
          </p>
        </div>

        {/* Edit + Delete */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => onEdit(session)}
            className="text-slate-600 hover:text-violet-400 transition-colors p-1.5"
            aria-label="Edit session"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="text-slate-600 hover:text-red-400 transition-colors p-1.5 -mr-1"
            aria-label="Delete session"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {session.notes && (
        <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
          {session.notes}
        </p>
      )}

      {session.duration && (
        <div className="flex items-center gap-1 mt-1.5 text-slate-600">
          <Clock size={11} />
          <span className="text-xs">{session.duration} min</span>
        </div>
      )}
    </div>
  </div>
)
