import { useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Card, CardHeader } from '../components/ui/Card'

function HeatmapSkeleton() {
  return (
    <div className="flex gap-[3px] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 53 }, (_, week) => (
        <div key={week} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }, (_, day) => (
            <div key={day} className="size-2.5 rounded-cell bg-surface-sunken" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function Report() {
  const { username = '' } = useParams()
  const { t } = useI18n()

  return (
    <div className="px-6 py-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="size-16 rounded-full bg-surface-sunken" aria-hidden="true" />
        <div>
          <h1 className="text-xl font-semibold text-ink">{username}</h1>
          <p className="text-sm text-ink-muted">@{username}</p>
        </div>
        <dl className="ml-auto flex items-stretch divide-x divide-line">
          {[t('report.totalContributions'), t('report.currentStreak'), t('report.peakHourValue')].map(
            (label) => (
              <div key={label} className="px-6 first:pl-0">
                <dt className="label-xs text-ink-subtle">{label}</dt>
                <dd className="nums mt-1 text-2xl font-semibold text-ink">—</dd>
              </div>
            ),
          )}
        </dl>
      </div>

      <Card className="mt-6">
        <CardHeader
          title={t('report.contributions')}
          meta={t('report.comingSoon')}
        />
        <div className="flex items-start justify-between gap-6 px-6 py-6">
          <HeatmapSkeleton />
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <span className="text-xs text-ink-subtle">Less</span>
            {[0, 1, 2, 3, 4].map((step) => (
              <span key={step} className="size-2.5 rounded-cell bg-surface-sunken" />
            ))}
            <span className="text-xs text-ink-subtle">More</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
