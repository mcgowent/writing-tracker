import { useMemo } from 'react'
import { getHeatmapGrid } from '../../lib/derived'
import type { Session } from '../../types'

interface HeatmapProps {
  sessions: Session[]
  today: string
}

const CELL = 12
const GAP = 3
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', '']

function cellColor(count: number, isFuture: boolean): string {
  if (isFuture) return '#0f172a'
  if (count === 0) return '#1e293b'
  if (count < 300)  return '#3b0764'
  if (count < 700)  return '#5b21b6'
  if (count < 1000) return '#7c3aed'
  return '#a78bfa'
}

const LEGEND_COLORS = ['#1e293b', '#3b0764', '#5b21b6', '#7c3aed', '#a78bfa']

export const Heatmap = ({ sessions, today }: HeatmapProps) => {
  const { weekColumns, monthLabels } = useMemo(
    () => getHeatmapGrid(sessions, today),
    [sessions, today],
  )

  const dayLabelWidth = 18
  const colWidth = CELL + GAP

  return (
    <div className="overflow-x-auto">
      <div style={{ width: dayLabelWidth + weekColumns.length * colWidth }}>
        {/* Month labels */}
        <div
          className="relative mb-1"
          style={{ marginLeft: dayLabelWidth, height: 16 }}
        >
          {monthLabels.map(({ colIndex, label }) => (
            <span
              key={colIndex}
              className="absolute text-xs text-slate-500"
              style={{ left: colIndex * colWidth }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Day labels + grid */}
        <div className="flex">
          {/* Day-of-week labels (Mon, Wed, Fri only) */}
          <div
            className="flex flex-col flex-shrink-0"
            style={{ width: dayLabelWidth, gap: GAP }}
          >
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-xs text-slate-600 flex items-center justify-end pr-1"
                style={{ height: CELL }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div className="flex" style={{ gap: GAP }}>
            {weekColumns.map((week, colIndex) => (
              <div key={colIndex} className="flex flex-col" style={{ gap: GAP }}>
                {week.map((cell) => (
                  <div
                    key={cell.dateStr}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 3,
                      backgroundColor: cellColor(cell.count, cell.isFuture),
                      flexShrink: 0,
                    }}
                    title={
                      cell.isFuture
                        ? ''
                        : cell.count > 0
                          ? `${cell.dateStr} · ${cell.count.toLocaleString()} words`
                          : cell.dateStr
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-xs text-slate-600">Less</span>
          {LEGEND_COLORS.map((color) => (
            <div
              key={color}
              style={{ width: CELL, height: CELL, borderRadius: 3, backgroundColor: color, flexShrink: 0 }}
            />
          ))}
          <span className="text-xs text-slate-600">More</span>
        </div>
      </div>
    </div>
  )
}
