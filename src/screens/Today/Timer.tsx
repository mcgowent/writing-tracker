import { useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useTimerStore } from '../../store/timerStore'

function fmt(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const Timer = () => {
  const { elapsed, isRunning, start, pause, reset, tick } = useTimerStore()

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isRunning, tick])

  const hasTime = elapsed > 0

  return (
    <div className="w-full bg-slate-800 rounded-2xl p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Session Timer
      </p>

      <div className="flex items-center justify-between gap-4">
        {/* Time display */}
        <span
          className={`text-3xl font-mono font-bold tabular-nums transition-colors ${
            isRunning ? 'text-violet-300' : hasTime ? 'text-slate-200' : 'text-slate-600'
          }`}
        >
          {fmt(elapsed)}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Start / Pause */}
          <button
            onClick={isRunning ? pause : start}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              isRunning
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Reset — only visible when there's time recorded */}
          <button
            onClick={reset}
            disabled={!hasTime}
            className="w-11 h-11 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {hasTime && !isRunning && (
        <p className="text-xs text-slate-500 mt-2">
          {Math.round(elapsed / 60)} min recorded — will pre-fill duration when you log.
        </p>
      )}
      {isRunning && (
        <p className="text-xs text-violet-400 mt-2">Timer running…</p>
      )}
    </div>
  )
}
