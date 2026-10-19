import { useI18n } from '../../i18n'
import { ChartCard } from '../charts/ChartCard'
import { WeekdayStrip } from '../charts/WeekdayStrip'
import { SourceNote } from '../charts/SourceNote'
import type { ReportMetrics } from '../../lib/metrics/types'

type WeekdayCardProps = {
  name: string
  metrics: ReportMetrics
  source: string
}

export function WeekdayCard({ name, metrics, source }: WeekdayCardProps) {
  const { t } = useI18n()
  const { weekdays } = metrics

  const labels = [
    t('report.weekday.mon'),
    t('report.weekday.tue'),
    t('report.weekday.wed'),
    t('report.weekday.thu'),
    t('report.weekday.fri'),
    t('report.weekday.sat'),
    t('report.weekday.sun'),
  ]

  return (
    <ChartCard title={t('report.weekdays')} footer={<SourceNote source={source} measure="pushes" />}>
      <div className="flex justify-center py-4">
        <WeekdayStrip
          counts={weekdays.counts}
          busiest={weekdays.busiest}
          labels={labels}
          name={name}
        />
      </div>
    </ChartCard>
  )
}
