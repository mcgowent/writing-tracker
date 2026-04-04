import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { getBestDayOfWeek } from '../../lib/derived'
import type { Session } from '../../types'

interface BestDaysChartProps {
  sessions: Session[]
}

export const BestDaysChart = ({ sessions }: BestDaysChartProps) => {
  const data = useMemo(() => getBestDayOfWeek(sessions), [sessions])
  const maxAvg = Math.max(...data.map(d => d.avg), 1)

  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barSize={22}>
        <XAxis
          dataKey="day"
          tick={{ fill: '#475569', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 10,
            fontSize: 12,
          }}
          labelStyle={{ color: '#94a3b8' }}
          itemStyle={{ color: '#e2e8f0' }}
          formatter={(value: number, _: string, entry: { payload?: { sessions?: number } }) => [
            `${value.toLocaleString()} avg words (${entry?.payload?.sessions ?? 0} days)`,
            '',
          ]}
        />
        <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.day}
              fill={entry.avg === maxAvg && entry.avg > 0 ? '#a78bfa' : '#4c1d95'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
