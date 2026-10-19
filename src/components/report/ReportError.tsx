import { useI18n } from '../../i18n'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { GitHubError } from '../../lib/github/errors'

type ReportErrorProps = {
  error: unknown
  onRetry: () => void
}

function messageFor(error: unknown, t: ReturnType<typeof useI18n>['t']): string {
  if (!GitHubError.is(error)) return t('report.error.unknown')

  switch (error.kind) {
    case 'not-found':
      return t('report.error.notFound')
    case 'rate-limited':
      return t('report.error.rateLimited', {
        time: error.resetAt
          ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(
              new Date(error.resetAt),
            )
          : '—',
      })
    case 'unauthorized':
      return t('report.error.unauthorized')
    case 'network':
      return t('report.error.network')
    default:
      return t('report.error.unknown')
  }
}

export function ReportError({ error, onRetry }: ReportErrorProps) {
  const { t } = useI18n()

  return (
    <div className="px-6 py-16">
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-base font-semibold text-ink">{t('report.errorTitle')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{messageFor(error, t)}</p>
        <Button variant="primary" className="mt-6" onClick={onRetry}>
          {t('report.retry')}
        </Button>
      </Card>
    </div>
  )
}
