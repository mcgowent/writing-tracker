interface ProgressRingProps {
  progress: number       // 0–1
  currentTotal: number
  targetTotal: number
  goalLabel?: string     // e.g. "today" or "this week"
  size?: number
  strokeWidth?: number
}

export const ProgressRing = ({
  progress,
  currentTotal,
  targetTotal,
  goalLabel = 'today',
  size = 180,
  strokeWidth = 12,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedProgress = Math.min(progress, 1)
  const offset = circumference * (1 - clampedProgress)
  const isComplete = progress >= 1

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? '#22c55e' : '#7c3aed'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
        />
      </svg>

      <div className="absolute flex flex-col items-center select-none">
        <span className="text-4xl font-bold text-slate-100 tabular-nums leading-none">
          {currentTotal.toLocaleString()}
        </span>
        <span className="text-xs text-slate-500 mt-1">
          of {targetTotal.toLocaleString()} — {goalLabel}
        </span>
        {isComplete && (
          <span className="text-xs text-green-400 font-semibold mt-1">Goal met!</span>
        )}
        {!isComplete && currentTotal > 0 && (
          <span className="text-xs text-violet-400 font-medium mt-1">
            {Math.round(clampedProgress * 100)}%
          </span>
        )}
      </div>
    </div>
  )
}
