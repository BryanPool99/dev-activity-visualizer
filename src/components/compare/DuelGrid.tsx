import { useMemo, useRef, useState } from 'react'
import { useI18n } from '../../i18n'
import { weekdayOf } from '../../lib/metrics/dates'
import { formatDay } from '../../lib/charts/format'
import { fitStrip } from '../../lib/charts/fit'
import { useContainerWidth } from '../../hooks/useContainerWidth'
import type { DuelDay } from '../../lib/metrics/duel'

type DuelGridProps = {
  days: DuelDay[]
  nameA: string
  nameB: string
  /** The cell edge the grid would like. It gets smaller if the width demands it. */
  cellSize?: number
}

/** Who led each day: A in ink, B in the accent, a tie in grey. */
const COLORS = {
  none: 'var(--duel-none)',
  tie: 'var(--duel-tie)',
  aStrong: 'var(--duel-first)',
  aWeak: 'var(--duel-first-weak)',
  bStrong: 'var(--duel-second)',
  bWeak: 'var(--duel-second-weak)',
} as const

function fillFor(day: DuelDay): string {
  if (day.winner === 'none') return COLORS.none
  if (day.winner === 'tie') return COLORS.tie

  const own = day.winner === 'a' ? day.a : day.b
  const other = day.winner === 'a' ? day.b : day.a
  const strong = own >= other * 2

  if (day.winner === 'a') return strong ? COLORS.aStrong : COLORS.aWeak
  return strong ? COLORS.bStrong : COLORS.bWeak
}

/**
 * Two accounts on one grid: each day belongs to whoever pushed more that day.
 * This is the reading GitHub's own graph cannot give.
 *
 * The cell size is solved from the width the container really has, so a year
 * fits a phone instead of being scaled into noise or pushed off the edge.
 */
export function DuelGrid({ days, nameA, nameB, cellSize }: DuelGridProps) {
  const [hovered, setHovered] = useState<DuelDay | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()
  const available = useContainerWidth(stripRef)

  const columns = useMemo(() => {
    if (days.length === 0) return 0
    const firstWeekday = weekdayOf(days[0].date)
    return Math.floor((days.length - 1 + firstWeekday) / 7) + 1
  }, [days])

  const preferred = cellSize ?? (columns <= 6 ? 22 : columns <= 12 ? 18 : columns <= 26 ? 14 : 10)
  const fit = useMemo(
    () => fitStrip(columns, available, preferred),
    [columns, available, preferred],
  )

  const { cells, width, height } = useMemo(() => {
    if (days.length === 0) {
      return { cells: [], width: 0, height: 0 }
    }

    const step = fit.cell + fit.gap
    const firstWeekday = weekdayOf(days[0].date)
    const built = days.map((day, index) => ({
      day,
      x: Math.floor((index + firstWeekday) / 7) * step,
      y: weekdayOf(day.date) * step,
    }))

    return {
      cells: built,
      // The gap sits between cells, so the last column carries no trailing gap.
      width: columns * fit.cell + (columns - 1) * fit.gap,
      height: 7 * (fit.cell + fit.gap) - fit.gap,
    }
  }, [days, fit, columns])

  if (days.length === 0) return null

  return (
    <div>
      <div ref={stripRef} className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${nameA} against ${nameB}, one square per day.`}
          className="shrink-0"
        >
          {cells.map((cell) => (
            <rect
              key={cell.day.date}
              x={cell.x}
              y={cell.y}
              width={fit.cell}
              height={fit.cell}
              rx={fit.radius}
              fill={fillFor(cell.day)}
              onMouseEnter={() => setHovered(cell.day)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-ink" />
          {nameA}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-accent" />
          {nameB}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-line-strong" />
          {t('compare.tie')}
        </span>
      </div>

      {hovered ? (
        <p className="mt-3 text-xs text-ink-muted">
          <span className="font-medium text-ink">{formatDay(hovered.date)}</span>
          <span className="nums ml-3">
            {nameA}: {hovered.a}
          </span>
          <span className="nums ml-3">
            {nameB}: {hovered.b}
          </span>
        </p>
      ) : null}
    </div>
  )
}
