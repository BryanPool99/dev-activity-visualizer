import { useI18n } from '../../i18n'
import type { DuelMetrics } from '../../lib/metrics/duel'

type DuelSummaryProps = {
  duel: DuelMetrics
  nameA: string
  nameB: string
}

/** Who led how many days. The duel grid says it per day; this says it at once. */
export function DuelSummary({ duel, nameA, nameB }: DuelSummaryProps) {
  const { t } = useI18n()

  const a = duel.days.filter((day) => day.winner === 'a').length
  const b = duel.days.filter((day) => day.winner === 'b').length
  const tie = duel.days.filter((day) => day.winner === 'tie').length
  const max = Math.max(a, b, tie, 1)

  const rows: { label: string; count: number; color: string }[] = [
    { label: nameA, count: a, color: 'var(--duel-first)' },
    { label: nameB, count: b, color: 'var(--duel-second)' },
    { label: t('compare.tie'), count: tie, color: 'var(--duel-tie)' },
  ]

  return (
    <div className="w-full shrink-0 sm:w-72">
      <h3 className="label-xs text-ink-subtle">{t('compare.daysLed')}</h3>
      <ul className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-xs text-ink-muted">{row.label}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
              <span
                className="block h-full rounded-full"
                style={{ width: `${(row.count / max) * 100}%`, backgroundColor: row.color }}
              />
            </span>
            <span className="nums w-12 shrink-0 text-right text-xs font-medium text-ink">
              {row.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
