import { useI18n } from '../../i18n'
import type { ReportMetrics } from '../../lib/metrics/types'

type ReportLedeProps = {
  metrics: ReportMetrics
}

/**
 * The report in one sentence.
 *
 * It sits under the identity band, where the total already stands as the
 * page's peak figure, so it continues the story instead of repeating the
 * number: when the work happened, how long it held, how many days it was alive.
 */
export function ReportLede({ metrics }: ReportLedeProps) {
  const { t } = useI18n()

  const { calendar, hours, streaks } = metrics

  if (hours.peakHour === null || streaks.longest === 0) {
    return (
      <p className="mt-5 max-w-4xl text-xl leading-relaxed text-ink-muted">
        {t('report.lede.brief', { activeDays: calendar.activeDays })}
      </p>
    )
  }

  return (
    <p className="mt-5 max-w-4xl text-xl leading-relaxed text-ink-muted">
      {t('report.lede.rest', {
        hour: String(hours.peakHour).padStart(2, '0'),
        streak: streaks.longest,
        activeDays: calendar.activeDays,
        totalDays: calendar.windowDays,
      })}
    </p>
  )
}
