import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useProjectsStore } from '../../store/projectsStore'

interface AddProjectSheetProps {
  open: boolean
  onClose: () => void
}

const PRESET_COLORS = [
  '#7c3aed', '#0891b2', '#059669', '#dc2626', '#d97706',
  '#db2777', '#4f46e5', '#0d9488', '#ea580c', '#65a30d',
]

const WORD_COUNT_PRESETS = [
  { label: 'Short story', value: 7500 },
  { label: 'Novella',     value: 40000 },
  { label: 'Novel',       value: 80000 },
  { label: 'Epic',        value: 120000 },
]

export const AddProjectSheet = ({ open, onClose }: AddProjectSheetProps) => {
  const addProject = useProjectsStore((s) => s.addProject)

  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [targetWords, setTargetWords] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setColor(PRESET_COLORS[0])
      setTargetWords('')
      setError('')
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Project name is required.'); return }
    const target = targetWords ? parseInt(targetWords, 10) : undefined
    addProject(name.trim(), color, target && target > 0 ? target : undefined)
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-slate-900 rounded-t-3xl z-[60] px-6 pt-5 pb-24 transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-100">New Project</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors p-1 -mr-1" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. My Novel"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 placeholder:text-slate-600 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-9 h-9 rounded-xl transition-transform active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: c + '33', border: `2px solid ${color === c ? c : 'transparent'}` }}
                  aria-label={c}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                </button>
              ))}
            </div>
          </div>

          {/* Word count target */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Word Count Target{' '}
              <span className="text-slate-600 normal-case font-normal">(optional)</span>
            </label>
            {/* Presets */}
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {WORD_COUNT_PRESETS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTargetWords(String(value))}
                  className={`py-2 rounded-xl text-xs font-semibold transition-colors ${
                    targetWords === String(value)
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Custom (e.g. 50000)"
              value={targetWords}
              onChange={(e) => setTargetWords(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 placeholder:text-slate-600 transition-colors"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 bg-slate-800 rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: color + '33' }}>
              <div className="w-full h-full rounded-lg flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 truncate">{name || 'Project name'}</p>
              {targetWords && parseInt(targetWords) > 0 && (
                <p className="text-xs text-slate-500">
                  Target: {parseInt(targetWords).toLocaleString()} words
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold rounded-xl py-3.5 text-sm transition-colors"
          >
            Create Project
          </button>
        </form>
      </div>
    </>
  )
}
