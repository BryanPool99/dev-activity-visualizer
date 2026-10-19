import { useMemo, useState } from 'react'
import { formatDay } from '../../lib/charts/format'
import { CONTRIBUTION_SCALE, contributionLevel } from '../../lib/charts/scale'
import type { DayCount } from '../../lib/metrics/types'

type DayColumnsProps = {
  days: DayCount[]
  unitLabel: string
  name: string
  palette?: readonly string[]
  height?: number
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
 * The same reading as the week grid, drawn for a window that is too short for
 * a week grid: one column per day, filling the width it is given.
 */
export function DayColumns({
  days,
  unitLabel,
  name,
  palette = CONTRIBUTION_SCALE,
  height = 132,
}: DayColumnsProps) {
  const [hovered, setHovered] = useState<{ day: DayCount; index: number } | null>(null)

  const max = useMemo(() => days.reduce((peak, day) => Math.max(peak, day.count), 0), [days])
  const total = days.reduce((sum, day) => sum + day.count, 0)
  const activeDays = days.filter((day) => day.count > 0).length

  const months = useMemo(() => {
    const marks: { index: number; label: string }[] = []
    let lastMonth = ''
    days.forEach((day, index) => {
      const month = day.date.slice(0, 7)
      if (month !== lastMonth) {
        marks.push({ index, label: MONTH_LABELS[Number(day.date.slice(5, 7)) - 1] })
        lastMonth = month
      }
    })
    return marks
  }, [days])

  if (days.length === 0) return null

  return (
    <div>
      <div
        className="relative flex items-end gap-[2px]"
        style={{ height }}
        role="img"
        aria-label={`${name}: ${total} ${unitLabel} across ${activeDays} active days.`}
      >
        {days.map((day, index) => {
          const ratio = max > 0 ? day.count / max : 0
          const barHeight = day.count > 0 ? Math.max(8, Math.round(ratio * 100)) : 2

          return (
            <div
              key={day.date}
              className="relative flex-1"
              style={{ height: `${barHeight}%` }}
              onMouseEnter={() => setHovered({ day, index })}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="h-full w-full rounded-t-[2px]"
                style={{ backgroundColor: palette[contributionLevel(day.count, max)] }}
              />
            </div>
          )
        })}

        {hovered ? (
          <div
            role="status"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-control border border-line bg-ground px-2.5 py-1.5 text-xs whitespace-nowrap shadow-sm"
            style={{
              left: `${((hovered.index + 0.5) / days.length) * 100}%`,
              bottom: `${(hovered.day.count > 0 && max > 0 ? (hovered.day.count / max) * 100 : 2) + 4}%`,
            }}
          >
            <span className="font-medium text-ink">{formatDay(hovered.day.date)}</span>
            <span className="nums ml-2 text-ink-muted">
              {hovered.day.count} {unitLabel}
            </span>
          </div>
        ) : null}
      </div>

      <div className="relative mt-2 h-4">
        {months.map((mark) => (
          <span
            key={`${mark.label}-${mark.index}`}
            className="absolute text-[10px] text-ink-subtle"
            style={{ left: `${(mark.index / days.length) * 100}%` }}
          >
            {mark.label}
          </span>
        ))}
      </div>
    </div>
  )
}
