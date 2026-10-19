import { useMemo } from 'react'
import { useI18n } from '../../i18n'
import { formatDay } from '../../lib/charts/format'
import type { DayCount } from '../../lib/metrics/types'

type TopDaysProps = {
  days: DayCount[]
  unitLabel: string
  limit?: number
}

/**
 * The days that carried the most weight. It gives the wide card a second
 * reading, and it works for a four-week window as well as for a full year.
 */
export function TopDays({ days, unitLabel, limit = 5 }: TopDaysProps) {
  const { t } = useI18n()

  const top = useMemo(
    () =>
      [...days]
        .filter((day) => day.count > 0)
        .sort((a, b) => b.count - a.count || a.date.localeCompare(b.date))
        .slice(0, limit),
    [days, limit],
  )

  const max = top[0]?.count ?? 0

  if (top.length === 0) return null

  return (
    <div>
      <h3 className="label-xs text-ink-subtle">{t('report.topDays')}</h3>
      <p className="mt-1 text-xs text-ink-muted">{unitLabel}</p>
      <ul className="mt-3 space-y-2.5">
        {top.map((day) => (
          <li key={day.date} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-xs text-ink-muted">{formatDay(day.date)}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
              <span
                className="block h-full rounded-full bg-ink"
                style={{ width: `${max > 0 ? (day.count / max) * 100 : 0}%` }}
              />
            </span>
            <span className="nums w-8 shrink-0 text-right text-xs font-medium text-ink">
              {day.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
