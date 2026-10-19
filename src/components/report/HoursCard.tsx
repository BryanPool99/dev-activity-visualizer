import { useI18n } from '../../i18n'
import { ChartCard } from '../charts/ChartCard'
import { HourDial } from '../charts/HourDial'
import { SourceNote } from '../charts/SourceNote'
import type { ReportMetrics } from '../../lib/metrics/types'

type HoursCardProps = {
  name: string
  metrics: ReportMetrics
  source: string
}

function utcOffsetLabel(): string {
  const offset = -new Date().getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const absolute = Math.abs(offset)
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0')
  const minutes = String(absolute % 60).padStart(2, '0')
  return `UTC${sign}${hours}:${minutes}`
}

export function HoursCard({ name, metrics, source }: HoursCardProps) {
  const { t } = useI18n()
  const { hours } = metrics

  return (
    <ChartCard
      title={t('report.hours')}
      meta={t('report.localTime', { offset: utcOffsetLabel() })}
      footer={<SourceNote source={source} measure="pushes" />}
    >
      <div className="flex justify-center py-2">
        <HourDial counts={hours.counts} peakHour={hours.peakHour} name={name} size={240} />
      </div>
    </ChartCard>
  )
}
