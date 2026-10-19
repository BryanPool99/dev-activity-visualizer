import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export function NotFound() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-xl font-semibold text-ink">{t('notFound.title')}</h1>
      <p className="mt-2 text-sm text-ink-muted">{t('notFound.body')}</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-9 items-center rounded-control border border-line px-3.5 text-sm font-medium text-ink hover:bg-surface"
      >
        {t('notFound.back')}
      </Link>
    </div>
  )
}
