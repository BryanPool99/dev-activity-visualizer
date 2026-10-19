type WeekdayStripProps = {
  /** 7 buckets, index 0 = Monday. */
  counts: number[]
  /** The index of the busiest day, 0 = Monday. */
  busiest: number | null
  labels: string[]
  name: string
}

const BAR_WIDTH = 28
const BAR_GAP = 12
const HEIGHT = 132

/** The week as seven columns, Monday first. */
export function WeekdayStrip({ counts, busiest, labels, name }: WeekdayStripProps) {
  const total = counts.reduce((sum, count) => sum + count, 0)
  const max = counts.reduce((peak, count) => Math.max(peak, count), 0)
  const width = labels.length * (BAR_WIDTH + BAR_GAP)

  return (
    <svg
      width={width}
      height={HEIGHT}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      role="img"
      aria-label={
        busiest === null
          ? `${name}: no activity by day of the week.`
          : `${name}: ${labels[busiest]} is the busiest day, with ${counts[busiest]} of ${total}.`
      }
    >
      {counts.map((count, index) => {
        const x = index * (BAR_WIDTH + BAR_GAP)
        const barHeight = max > 0 ? Math.round((count / max) * (HEIGHT - 34)) : 0
        const isPeak = index === busiest

        return (
          <g key={labels[index]}>
            <rect
              x={x}
              y={HEIGHT - 26 - barHeight}
              width={BAR_WIDTH}
              height={barHeight}
              rx={3}
              fill={isPeak ? 'var(--ink)' : 'var(--line-strong)'}
            />
            <text
              x={x + BAR_WIDTH / 2}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-ink-subtle text-[11px]"
            >
              {labels[index]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
