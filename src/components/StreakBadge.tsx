import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  count: number
}

export const StreakBadge = ({ count }: StreakBadgeProps) => (
  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full border border-orange-500/20">
    <Flame size={15} className="fill-orange-400" />
    <span className="text-sm font-semibold tabular-nums">
      {count} day{count !== 1 ? 's' : ''} streak
    </span>
  </div>
)
