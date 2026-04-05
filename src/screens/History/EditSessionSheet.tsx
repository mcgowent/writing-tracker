import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useSessionsStore } from '../../store/sessionsStore'
import { useProjectsStore } from '../../store/projectsStore'
import type { Session } from '../../types'

interface EditSessionSheetProps {
  session: Session | null
  onClose: () => void
}

export const EditSessionSheet = ({ session, onClose }: EditSessionSheetProps) => {
  const updateSession = useSessionsStore((s) => s.updateSession)
  const projects = useProjectsStore((s) => s.projects)

  const [projectId, setProjectId] = useState('')
  const [wordCount, setWordCount] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  // Populate fields whenever a session is passed in
  useEffect(() => {
    if (session) {
      setProjectId(session.projectId)
      setWordCount(String(session.wordCount))
      setDuration(session.duration ? String(session.duration) : '')
      setNotes(session.notes ?? '')
      setError('')
    }
  }, [session])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    const count = parseInt(wordCount, 10)
    if (!wordCount || isNaN(count) || count <= 0) {
      setError('Please enter a valid word count.')
      return
    }
    const mins = duration ? parseInt(duration, 10) : undefined
    updateSession(session.id, {
      projectId,
      wordCount: count,
      duration: mins && mins > 0 ? mins : undefined,
      notes: notes.trim() || undefined,
    })
    onClose()
  }

  const open = session !== null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-slate-900 rounded-t-3xl z-[60] px-6 pt-5 pb-24 transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-100">Edit Session</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors p-1 -mr-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Project */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Word count + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Words Written
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={wordCount}
                onChange={(e) => { setWordCount(e.target.value); setError('') }}
                className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 transition-colors"
              />
              {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Duration{' '}
                <span className="text-slate-600 normal-case font-normal">(min)</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="—"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Notes{' '}
              <span className="text-slate-600 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="What did you write about?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 placeholder:text-slate-600 resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold rounded-xl py-3.5 text-sm transition-colors mt-1"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  )
}
