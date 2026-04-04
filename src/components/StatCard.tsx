interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export const StatCard = ({ label, value, sub, accent = false }: StatCardProps) => (
  <div
    className={`rounded-2xl p-4 flex flex-col gap-1 ${
      accent ? 'bg-violet-600' : 'bg-slate-800'
    }`}
  >
    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
      {label}
    </span>
    <span
      className={`text-2xl font-bold tabular-nums ${
        accent ? 'text-white' : 'text-slate-100'
      }`}
    >
      {value}
    </span>
    {sub && (
      <span className={`text-xs ${accent ? 'text-violet-200' : 'text-slate-500'}`}>
        {sub}
      </span>
    )}
  </div>
)
