import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Card, CardHeader } from '../components/ui/Card'

export function Compare() {
  const [params] = useSearchParams()
  const { t } = useI18n()
  const a = params.get('a') ?? ''
  const b = params.get('b') ?? ''

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <h1 className="text-xl font-semibold text-ink">{t('compare.title')}</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {a || b ? `${a} · ${b}` : t('compare.comingSoon')}
      </p>

      <Card className="mt-6">
        <CardHeader title={t('report.contributions')} meta={t('compare.comingSoon')} />
        <div className="px-6 py-10" />
      </Card>
    </div>
  )
}
