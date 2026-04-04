import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { getWordsOverTime } from '../../lib/derived'
import type { Session } from '../../types'

interface TrendsChartProps {
  sessions: Session[]
  today: string
  target: number
  days?: number
}

export const TrendsChart = ({ sessions, today, target, days = 30 }: TrendsChartProps) => {
  const data = useMemo(
    () => getWordsOverTime(sessions, days, today),
    [sessions, today, days],
  )

  // Show a label every ~5 days to avoid crowding
  const tickInterval = Math.floor(days / 6)

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="shortLabel"
          tick={{ fill: '#475569', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
        />
        <Tooltip
          cursor={{ stroke: '#7c3aed', strokeWidth: 1, strokeDasharray: '3 3' }}
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 10,
            fontSize: 12,
          }}
          labelStyle={{ color: '#94a3b8' }}
          itemStyle={{ color: '#e2e8f0' }}
          labelFormatter={(_: unknown, payload: unknown[]) => {
            if (payload && (payload as { payload?: { label?: string } }[])[0]?.payload?.label) {
              return (payload as { payload: { label: string } }[])[0].payload.label
            }
            return ''
          }}
          formatter={(value: number) => [value.toLocaleString() + ' words', '']}
        />
        <ReferenceLine y={target} stroke="#7c3aed" strokeDasharray="4 3" strokeOpacity={0.4} />
        <Area
          type="monotone"
          dataKey="words"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#areaGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#a78bfa' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
