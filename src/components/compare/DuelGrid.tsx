import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import { weekdayOf } from '../../lib/metrics/dates'
import { formatDay } from '../../lib/charts/format'
import type { DuelDay } from '../../lib/metrics/duel'

type DuelGridProps = {
  days: DuelDay[]
  nameA: string
  nameB: string
  cellSize?: number
  gap?: number
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
 */
export function DuelGrid({ days, nameA, nameB, cellSize, gap = 3 }: DuelGridProps) {
  const [hovered, setHovered] = useState<DuelDay | null>(null)
  const { t } = useI18n()

  const columns = useMemo(() => {
    if (days.length === 0) return 0
    const firstWeekday = weekdayOf(days[0].date)
    return Math.floor((days.length - 1 + firstWeekday) / 7) + 1
  }, [days])

  const resolvedCellSize = cellSize ?? (columns <= 6 ? 22 : columns <= 12 ? 18 : columns <= 26 ? 14 : 10)

  const { cells, width, height, labelHeight, labelWidth } = useMemo(() => {
    if (days.length === 0) {
      return { cells: [], width: 0, height: 0, labelHeight: 16, labelWidth: 28 }
    }

    const step = resolvedCellSize + gap
    const firstWeekday = weekdayOf(days[0].date)
    const built = days.map((day, index) => ({
      day,
      x: Math.floor((index + firstWeekday) / 7) * step,
      y: weekdayOf(day.date) * step,
    }))

    return {
      cells: built,
      width: 28 + columns * step,
      height: 16 + 7 * step,
      labelHeight: 16,
      labelWidth: 28,
    }
  }, [days, resolvedCellSize, gap, columns])

  if (days.length === 0) return null

  return (
    <div>
      {/* A year of weeks is wider than a phone. The grid keeps its natural
          size and the strip scrolls sideways, the way GitHub's own graph does,
          rather than shrinking the squares into nothing. */}
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${nameA} against ${nameB}, one square per day.`}
          className="shrink-0"
        >
          <g transform={`translate(${labelWidth}, ${labelHeight})`}>
            {cells.map((cell) => (
              <rect
                key={cell.day.date}
                x={cell.x}
                y={cell.y}
                width={resolvedCellSize}
                height={resolvedCellSize}
                rx={2}
                fill={fillFor(cell.day)}
                onMouseEnter={() => setHovered(cell.day)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </g>
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
        <span className="w-full text-ink-subtle sm:hidden">{t('chart.scrollHint')}</span>
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
