import { useMemo, useRef, useState } from 'react'
import { weekdayOf } from '../../lib/metrics/dates'
import { contributionFill, contributionLevel } from '../../lib/charts/scale'
import { fitStrip } from '../../lib/charts/fit'
import { useContainerWidth } from '../../hooks/useContainerWidth'
import { formatDay } from '../../lib/charts/format'
import type { DayCount } from '../../lib/metrics/types'

type HeatmapProps = {
  days: DayCount[]
  /** The cell edge the grid would like. It gets smaller if the width demands it. */
  cellSize?: number
  /** The label of the thing a cell counts. */
  unitLabel: string
  /** The name of the account, for the accessible summary. */
  name: string
}

type Position = {
  x: number
  y: number
}

/** The cell size the grid would use if the width allowed it. */
function preferredCellSize(columns: number): number {
  if (columns <= 6) return 22
  if (columns <= 12) return 18
  if (columns <= 26) return 14
  return 10
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

/**
 * The contribution grid: one column per week, one row per weekday, the way
 * GitHub draws it.
 *
 * Its cell size is solved from the width the container really has, so a year
 * fits a phone instead of being scaled into noise or pushed off the edge.
 */
export function Heatmap({ days, cellSize, unitLabel, name }: HeatmapProps) {
  const [hovered, setHovered] = useState<{ day: DayCount; at: Position } | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const available = useContainerWidth(stripRef)

  const max = useMemo(() => days.reduce((peak, day) => Math.max(peak, day.count), 0), [days])

  const columns = useMemo(() => {
    if (days.length === 0) return 0
    const firstWeekday = weekdayOf(days[0].date)
    return Math.floor((days.length - 1 + firstWeekday) / 7) + 1
  }, [days])

  const fit = useMemo(
    () => fitStrip(columns, available, cellSize ?? preferredCellSize(columns)),
    [columns, available, cellSize],
  )

  const { cells, monthLabels, width, height, labelHeight } = useMemo(() => {
    if (days.length === 0) {
      return { cells: [], monthLabels: [], width: 0, height: 0, labelHeight: 0 }
    }

    const step = fit.cell + fit.gap
    const firstWeekday = weekdayOf(days[0].date)

    const built: { day: DayCount; x: number; y: number; level: number }[] = []
    const months: { x: number; month: number }[] = []
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
        if (fit.showMonths && (!previous || x - previous.x >= fit.cell * 3)) {
          months.push({ x, month })
        }
        lastMonth = month
      }
    })

    const labelHeight = fit.showMonths ? 16 : 0

    return {
      cells: built,
      monthLabels: months,
      // The gap sits between cells, so the last column carries no trailing gap.
      width: fit.labelWidth + columns * fit.cell + (columns - 1) * fit.gap,
      height: labelHeight + 7 * (fit.cell + fit.gap) - fit.gap,
      labelHeight,
    }
  }, [days, fit, max, columns])

  if (days.length === 0) return null

  const total = days.reduce((sum, day) => sum + day.count, 0)
  const activeDays = days.filter((day) => day.count > 0).length
  const period = `${formatDay(days[0].date)} – ${formatDay(days[days.length - 1].date)}`

  function trackPointer(event: React.MouseEvent, day: DayCount) {
    const frame = stripRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    setHovered({
      day,
      at: {
        x: event.clientX - rect.left + frame.scrollLeft,
        y: event.clientY - rect.top,
      },
    })
  }

  return (
    <div>
      <div ref={stripRef} className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${name}: ${total} ${unitLabel} across ${activeDays} active days.`}
          className="shrink-0"
        >
          <g transform={`translate(${fit.labelWidth}, ${labelHeight})`}>
            {monthLabels.map((label) => (
              <text
                key={`${label.month}-${label.x}`}
                x={label.x}
                y={-4}
                className="fill-ink-subtle text-[11px]"
              >
                {MONTH_LABELS[label.month - 1]}
              </text>
            ))}

            {fit.showWeekdays
              ? [
                  { row: 1, label: 'Mon' },
                  { row: 3, label: 'Wed' },
                  { row: 5, label: 'Fri' },
                ].map((entry) => (
                  <text
                    key={entry.label}
                    x={-8}
                    y={entry.row * (fit.cell + fit.gap) + fit.cell - 1}
                    textAnchor="end"
                    className="fill-ink-subtle text-[11px]"
                  >
                    {entry.label}
                  </text>
                ))
              : null}

            {cells.map((cell) => (
              <rect
                key={cell.day.date}
                x={cell.x}
                y={cell.y}
                width={fit.cell}
                height={fit.cell}
                rx={fit.radius}
                fill={contributionFill(cell.level)}
                onMouseEnter={(event) => trackPointer(event, cell.day)}
                onMouseMove={(event) => trackPointer(event, cell.day)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </g>
        </svg>
      </div>

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

      <p className="mt-3 text-xs text-ink-subtle sm:hidden">{period}</p>
    </div>
  )
}
