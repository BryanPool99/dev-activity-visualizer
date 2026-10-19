type HourDialProps = {
  /** 24 buckets, index 0 = midnight. */
  counts: number[]
  /** The hour to mark as the peak. */
  peakHour: number | null
  /** The name of the account, for the accessible summary. */
  name: string
  size?: number
}

const HOUR_LABELS = ['00', '03', '06', '09', '12', '15', '18', '21']

/**
 * The day as a clock face: one spoke per hour, long where the work happens.
 *
 * It reads at a glance in a way a bar chart of 24 columns does not, and it is
 * the instrument the comparison surface shares between two accounts.
 */
export function HourDial({ counts, peakHour, name, size = 260 }: HourDialProps) {
  const total = counts.reduce((sum, count) => sum + count, 0)
  const max = counts.reduce((peak, count) => Math.max(peak, count), 0)

  const center = size / 2
  const inner = size * 0.2
  const outer = size * 0.43
  const stroke = size * 0.055

  const radius = (hour: number) => {
    if (max <= 0) return inner
    return inner + (outer - inner) * (counts[hour] / max)
  }

  const angle = (hour: number) => (hour / 24) * Math.PI * 2 - Math.PI / 2

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={
          peakHour === null
            ? `${name}: no time-of-day activity in the window.`
            : `${name}: the busiest hour is ${peakHour}:00, with ${counts[peakHour]} of ${total}.`
        }
      >
        <circle cx={center} cy={center} r={inner - stroke / 2} fill="none" stroke="#e5e7eb" strokeWidth={1} />

        {counts.map((count, hour) => {
          if (count <= 0) return null
          const a = angle(hour)
          const length = radius(hour)
          const x1 = center + Math.cos(a) * inner
          const y1 = center + Math.sin(a) * inner
          const x2 = center + Math.cos(a) * length
          const y2 = center + Math.sin(a) * length
          const isPeak = hour === peakHour

          return (
            <line
              key={hour}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isPeak ? '#111827' : '#d1d5db'}
              strokeWidth={isPeak ? stroke * 1.15 : stroke}
              strokeLinecap="round"
            />
          )
        })}

        {HOUR_LABELS.map((label, index) => {
          const hour = index * 3
          const a = angle(hour)
          const r = outer + stroke * 0.9
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
    </div>
  )
}
