import { useMemo } from 'react'
import { useI18n } from '../../i18n'
import { formatDay } from '../../lib/charts/format'
import type { DayCount } from '../../lib/metrics/types'

type TopDaysInlineProps = {
  days: DayCount[]
  unitLabel: string
  limit?: number
}

/**
 * The heaviest days, in one line. Used where the chart already shows every day
 * and a panel would say the same thing twice.
 */
export function TopDaysInline({ days, unitLabel, limit = 5 }: TopDaysInlineProps) {
  const { t } = useI18n()

  const top = useMemo(
    () =>
      [...days]
        .filter((day) => day.count > 0)
        .sort((a, b) => b.count - a.count || a.date.localeCompare(b.date))
        .slice(0, limit),
    [days, limit],
  )

  if (top.length === 0) return null

  return (
    <p className="text-xs text-ink-muted">
      <span className="label-xs mr-2 text-ink-subtle">{t('report.topDays')}</span>
      {top.map((day, index) => (
        <span key={day.date}>
          {index > 0 ? <span aria-hidden="true" className="mx-2 text-ink-subtle">·</span> : null}
          <span className="text-ink">{formatDay(day.date)}</span>
          <span className="nums ml-1 font-medium text-ink">{day.count}</span>
        </span>
      ))}
      <span className="ml-2 text-ink-subtle">{unitLabel}</span>
    </p>
  )
}
