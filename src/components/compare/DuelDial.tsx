import { useI18n } from '../../i18n'

type DuelDialProps = {
  /** 24 buckets for the first account. */
  countsA: number[]
  /** 24 buckets for the second account. */
  countsB: number[]
  /** The hours where both accounts were active. */
  sharedHours: number[]
  nameA: string
  nameB: string
  size?: number
}

const HOUR_LABELS = ['00', '03', '06', '09', '12', '15', '18', '21']

/**
 * One clock, two rhythms.
 *
 * The inner ring is the first account, the outer ring the second, and the hours
 * where the two worked at the same time are marked on the rim. It is the only
 * reading in the app that a single profile page cannot give.
 */
export function DuelDial({
  countsA,
  countsB,
  sharedHours,
  nameA,
  nameB,
  size = 280,
}: DuelDialProps) {
  const { t } = useI18n()

  const max = Math.max(...countsA, ...countsB, 0)
  const center = size / 2
  const innerA = size * 0.17
  const outerA = size * 0.31
  const innerB = size * 0.34
  const outerB = size * 0.41
  const stroke = size * 0.034
  const labelRadius = size * 0.47
  // The shared hour sits in the gap between the two bands: neither account's
  // colour, exactly where the two of them meet.
  const markerRadius = (outerA + innerB) / 2

  const angle = (hour: number) => (hour / 24) * Math.PI * 2 - Math.PI / 2

  function spoke(hour: number, from: number, to: number) {
    const a = angle(hour)
    return {
      x1: center + Math.cos(a) * from,
      y1: center + Math.sin(a) * from,
      x2: center + Math.cos(a) * to,
      y2: center + Math.sin(a) * to,
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${nameA} and ${nameB} by hour of the day, with ${sharedHours.length} shared hours.`}
      >
        <circle
          cx={center}
          cy={center}
          r={innerA - stroke / 2}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
        />

        {countsA.map((count, hour) => {
          if (count <= 0) return null
          const length = innerA + (outerA - innerA) * (count / max)
          const { x1, y1, x2, y2 } = spoke(hour, innerA, length)
          return (
            <line
              key={`a-${hour}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#111827"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          )
        })}

        {countsB.map((count, hour) => {
          if (count <= 0) return null
          const length = innerB + (outerB - innerB) * (count / max)
          const { x1, y1, x2, y2 } = spoke(hour, innerB, length)
          return (
            <line
              key={`b-${hour}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#2563eb"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          )
        })}

        {sharedHours.map((hour) => {
          const a = angle(hour)
          const r = markerRadius
          return (
            <circle
              key={`s-${hour}`}
              cx={center + Math.cos(a) * r}
              cy={center + Math.sin(a) * r}
              r={stroke * 0.46}
              fill="#ffffff"
              stroke="#111827"
              strokeWidth={stroke * 0.26}
            />
          )
        })}

        {HOUR_LABELS.map((label, index) => {
          const hour = index * 3
          const a = angle(hour)
          const r = labelRadius
          return (
            <text
              key={label}
              x={center + Math.cos(a) * r}
              y={center + Math.sin(a) * r}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ink-subtle text-[11px]"
            >
              {label}
            </text>
          )
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-ink" />
          {nameA}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-accent" />
          {nameB}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-full border-2 border-ink bg-ground" />
          {t('compare.sharedHours')}
        </span>
      </div>
    </div>
  )
}
