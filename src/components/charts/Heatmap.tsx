import { useMemo, useRef, useState } from 'react'
import { weekdayOf } from '../../lib/metrics/dates'
import type { DayCount } from '../../lib/metrics/types'
import { CONTRIBUTION_SCALE, contributionLevel } from '../../lib/charts/scale'
import { formatDay } from '../../lib/charts/format'

type HeatmapProps = {
  days: DayCount[]
  /** The palette for the steps. The light scale by default. */
  palette?: readonly string[]
  /** Cell edge in pixels. */
  cellSize?: number
  /** Gap between cells, in pixels. */
  gap?: number
  /** The label of the thing a cell counts. */
  unitLabel: string
  /** The name of the account, for the accessible summary. */
  name: string
}

type Position = {
  x: number
  y: number
}

/**
 * The contribution grid: one column per week, one row per weekday, the way
 * GitHub draws it. A reading of a year of effort at a glance.
 */
export function Heatmap({
  days,
  palette = CONTRIBUTION_SCALE,
  cellSize = 10,
  gap = 3,
  unitLabel,
  name,
}: HeatmapProps) {
  const [hovered, setHovered] = useState<{ day: DayCount; at: Position } | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  const max = useMemo(() => days.reduce((peak, day) => Math.max(peak, day.count), 0), [days])

  const { cells, monthLabels, width, height } = useMemo(() => {
    if (days.length === 0) {
      return { cells: [], monthLabels: [], width: 0, height: 0 }
    }

    const step = cellSize + gap
    const firstWeekday = weekdayOf(days[0].date)

    const built: { day: DayCount; x: number; y: number; level: number }[] = []
    const months: { x: number; label: number; month: number }[] = []
    let lastMonth = -1

    days.forEach((day, index) => {
      const column = Math.floor((index + firstWeekday) / 7)
      const row = weekdayOf(day.date)
      const x = column * step
      const y = row * step

      built.push({ day, x, y, level: contributionLevel(day.count, max) })

      const month = Number(day.date.slice(5, 7))
      if (month !== lastMonth) {
        // Two labels need room between them, or they read as one.
        const previous = months[months.length - 1]
        if (!previous || x - previous.x >= 34) {
          months.push({ x, label: month, month })
        }
        lastMonth = month
      }
    })

    const columnCount = Math.max(...built.map((cell) => cell.x)) / step + 1
    const labelHeight = 16
    const weekdayLabelWidth = 28

    return {
      cells: built,
      monthLabels: months,
      width: weekdayLabelWidth + columnCount * step,
      height: labelHeight + 7 * step,
    }
  }, [days, cellSize, gap, max])

  if (days.length === 0) return null

  const total = days.reduce((sum, day) => sum + day.count, 0)
  const activeDays = days.filter((day) => day.count > 0).length

  function trackPointer(event: React.MouseEvent, day: DayCount) {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    setHovered({
      day,
      at: { x: event.clientX - rect.left, y: event.clientY - rect.top },
    })
  }

  return (
    <div className="relative" ref={frameRef}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${name}: ${total} ${unitLabel} across ${activeDays} active days.`}
        className="max-w-full"
      >
        <g transform={`translate(28, 16)`}>
          {monthLabels.map((label) => (
            <text
              key={`${label.month}-${label.x}`}
              x={label.x}
              y={-4}
              className="fill-ink-subtle text-[10px]"
            >
              {MONTH_LABELS[label.month - 1]}
            </text>
          ))}

          {WEEKDAY_ROWS.map((entry) =>
            entry === null ? null : (
              <text
                key={entry.label}
                x={-8}
                y={entry.row * (cellSize + gap) + cellSize - 1}
                textAnchor="end"
                className="fill-ink-subtle text-[10px]"
              >
                {entry.label}
              </text>
            ),
          )}

          {cells.map((cell) => (
            <rect
              key={cell.day.date}
              x={cell.x}
              y={cell.y}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={palette[cell.level]}
              onMouseEnter={(event) => trackPointer(event, cell.day)}
              onMouseMove={(event) => trackPointer(event, cell.day)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </g>
      </svg>

      {hovered ? (
        <div
          role="status"
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-control border border-line bg-ground px-2.5 py-1.5 text-xs whitespace-nowrap shadow-sm"
          style={{ left: hovered.at.x, top: hovered.at.y - 8 }}
        >
          <span className="font-medium text-ink">{formatDay(hovered.day.date)}</span>
          <span className="nums ml-2 text-ink-muted">
            {hovered.day.count} {unitLabel}
          </span>
        </div>
      ) : null}
    </div>
  )
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Only Monday, Wednesday and Friday are labelled, the way GitHub does it. */
const WEEKDAY_ROWS: ({ row: number; label: string } | null)[] = [
  null,
  { row: 1, label: 'Mon' },
  null,
  { row: 3, label: 'Wed' },
  null,
  { row: 5, label: 'Fri' },
  null,
]
