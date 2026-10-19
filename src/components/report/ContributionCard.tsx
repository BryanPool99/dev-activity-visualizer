import { useI18n } from '../../i18n'
import { Heatmap } from '../charts/Heatmap'
import { ContributionLegend } from '../charts/ContributionLegend'
import { SourceNote } from '../charts/SourceNote'
import { Card } from '../ui/Card'
import { TopDays } from './TopDays'
import type { ReportMetrics } from '../../lib/metrics/types'

type ContributionCardProps = {
  name: string
  metrics: ReportMetrics
  source: string
}

/** The centrepiece: a year of days, read in one glance. */
export function ContributionCard({ name, metrics, source }: ContributionCardProps) {
  const { t } = useI18n()
  const { calendar } = metrics

  const title =
    calendar.measure === 'contributions'
      ? t('report.contributionsFull')
      : t('report.contributionsPartial', { days: calendar.windowDays })

  const unit =
    calendar.measure === 'contributions'
      ? t('report.unit.contributions')
      : t('report.unit.pushes')

  return (
    <Card>
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-6 py-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <span className="nums text-xs text-ink-muted">
          {calendar.windowDays} {t('report.days')}
        </span>
      </header>

      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6 px-6 pt-1 pb-2">
        {calendar.days.length > 0 ? (
          <Heatmap days={calendar.days} unitLabel={unit} name={name} />
        ) : (
          <p className="py-10 text-sm text-ink-muted">{t('report.noActivity')}</p>
        )}
        <div className="w-full shrink-0 sm:w-80">
          <TopDays days={calendar.days} unitLabel={unit} />
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 px-6 pt-2 pb-5">
        <SourceNote
          source={source}
          measure={calendar.measure}
          detail={calendar.truncated ? t('report.feedTruncated') : undefined}
        />
        <ContributionLegend />
      </footer>
    </Card>
  )
}
