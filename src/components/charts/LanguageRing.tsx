import type { LanguageSlice } from '../../lib/metrics/types'
import { languageColor } from '../../lib/charts/language-colors'

type LanguageRingProps = {
  items: LanguageSlice[]
  /** The unit the values are counted in, shown in the middle. */
  measureLabel: string
  /** What the values mean: bytes of code, or repositories. */
  measure: 'bytes' | 'repositories'
  size?: number
  thickness?: number
}

/** A donut of language shares, with the leading language named in the middle. */
export function LanguageRing({
  items,
  measureLabel,
  measure,
  size = 168,
  thickness = 18,
}: LanguageRingProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  const leader = items[0]

  let offset = 0

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img"
        aria-label={
          leader
            ? `${leader.name} takes ${Math.round(leader.share * 100)}% of the ${measureLabel}.`
            : 'No languages to show.'
        }
      >
        <g transform={`rotate(-90 ${center} ${center})`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--surface-sunken)"
            strokeWidth={thickness}
          />
          {items.map((item) => {
            const length = total > 0 ? (item.value / total) * circumference : 0
            const dash = `${length} ${circumference - length}`
            const element = (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={languageColor(item.name, item.color)}
                strokeWidth={thickness}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              />
            )
            offset += length
            return element
          })}
        </g>
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="fill-ink text-[28px] font-semibold"
        >
          {leader ? `${Math.round(leader.share * 100)}%` : '—'}
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          className="fill-ink-subtle text-[11px]"
        >
          {leader ? leader.name : measureLabel}
        </text>
      </svg>

      <ul className="min-w-0 flex-1 space-y-1.5">
        {items.slice(0, 6).map((item) => (
          <li key={item.name} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: languageColor(item.name, item.color) }}
            />
            <span className="truncate text-ink">{item.name}</span>
            <span className="nums ml-auto text-ink-muted">
              {formatValue(item.value, measure)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatValue(value: number, measure: 'bytes' | 'repositories'): string {
  if (measure === 'bytes') {
    if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`
    if (value >= 1024) return `${Math.round(value / 1024)} kB`
    return `${value} B`
  }
  return new Intl.NumberFormat().format(value)
}
