import { useI18n } from '../../i18n'
import { ChartCard } from '../charts/ChartCard'
import { LanguageRing } from '../charts/LanguageRing'
import { SourceNote } from '../charts/SourceNote'
import type { ReportMetrics } from '../../lib/metrics/types'

type LanguageCardProps = {
  metrics: ReportMetrics
  source: string
}

export function LanguageCard({ metrics, source }: LanguageCardProps) {
  const { t } = useI18n()
  const { languages } = metrics

  return (
    <ChartCard
      title={t('report.languages')}
      meta={
        languages.measure === 'bytes'
          ? t('report.measure.bytes')
          : t('report.measure.repositories')
      }
      footer={<SourceNote source={source} measure={languages.measure} />}
    >
      {languages.items.length > 0 ? (
        <LanguageRing
          items={languages.items}
          measureLabel={
            languages.measure === 'bytes' ? t('report.measure.bytes') : t('report.measure.repositories')
          }
          measure={languages.measure}
        />
      ) : (
        <p className="py-8 text-center text-sm text-ink-muted">{t('report.noLanguages')}</p>
      )}
    </ChartCard>
  )
}
