import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, ReferenceLine,
  ResponsiveContainer, Tooltip, Cell,
} from 'recharts'
import { getLast14DaysTotals } from '../../lib/derived'
import type { Session } from '../../types'

interface WeeklyChartProps {
  sessions: Session[]
  today: string
  target: number
}

export const WeeklyChart = ({ sessions, today, target }: WeeklyChartProps) => {
  const data = useMemo(
    () => getLast14DaysTotals(sessions, today),
    [sessions, today],
  )

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
        barSize={14}
      >
        <XAxis
          dataKey="label"
          tick={{ fill: '#475569', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
          }
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
          formatter={(value: number) => [value.toLocaleString() + ' words', '']}
        />
        {/* Goal reference line */}
        <ReferenceLine
          y={target}
          stroke="#7c3aed"
          strokeDasharray="4 3"
          strokeOpacity={0.5}
        />
        <Bar dataKey="words" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.date}
              fill={
                entry.words >= target
                  ? '#22c55e'       // goal met — green
                  : entry.isToday
                    ? '#a78bfa'     // today — light violet
                    : '#4c1d95'     // past day — dark violet
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
