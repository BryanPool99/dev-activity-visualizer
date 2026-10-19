import { useI18n } from '../../i18n'
import { ChartCard } from '../charts/ChartCard'
import type { RawUserData } from '../../lib/github/types'

type SourcesCardProps = {
  data: RawUserData
}

function utcOffsetLabel(): string {
  const offset = -new Date().getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const absolute = Math.abs(offset)
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0')
  const minutes = String(absolute % 60).padStart(2, '0')
  return `UTC${sign}${hours}:${minutes}`
}

/**
 * The whole reading, laid out: where each number came from and what it counts.
 * A report that shows its work is a report you can trust.
 */
export function SourcesCard({ data }: SourcesCardProps) {
  const { t } = useI18n()

  const rows: { label: string; value: string }[] = [
    { label: t('report.profile'), value: data.sources.profile },
    { label: t('report.repositories'), value: data.sources.repos },
    { label: t('report.unit.pushes'), value: data.sources.pushes },
  ]

  if (data.calendar) {
    rows.push({ label: t('report.contributionsFull'), value: data.sources.calendar })
  }

  return (
    <ChartCard title={t('report.sources')}>
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className="text-xs font-medium text-ink">{row.value}</dd>
          </div>
        ))}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <dt className="text-sm text-ink-muted">{t('report.timezone')}</dt>
          <dd className="text-xs font-medium text-ink">{utcOffsetLabel()}</dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-subtle">
        {t('report.sourcesNote')}
      </p>
    </ChartCard>
  )
}
