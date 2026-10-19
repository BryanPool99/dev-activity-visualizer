import { useI18n } from '../../i18n'
import { ChartCard } from '../charts/ChartCard'
import { SourceNote } from '../charts/SourceNote'
import type { ReportMetrics } from '../../lib/metrics/types'

type RepositoriesCardProps = {
  metrics: ReportMetrics
  source: string
}

export function RepositoriesCard({ metrics, source }: RepositoriesCardProps) {
  const { t } = useI18n()
  const { repos } = metrics

  return (
    <ChartCard
      title={t('report.repositories')}
      meta={`${repos.total} · ${new Intl.NumberFormat().format(repos.stars)} ${t('report.stars')}`}
      footer={
        <SourceNote
          source={source}
          detail={repos.truncated > 0 ? t('report.truncatedRepos', { count: repos.truncated }) : undefined}
        />
      }
    >
      {repos.top.length > 0 ? (
        <ul className="divide-y divide-line">
          {repos.top.map((repo) => (
            <li key={repo.fullName} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block truncate text-sm font-medium text-ink hover:text-accent"
                >
                  {repo.name}
                </a>
                {repo.description ? (
                  <p className="truncate text-xs text-ink-muted">{repo.description}</p>
                ) : null}
              </div>
              <span className="nums shrink-0 text-xs text-ink-muted">
                {new Intl.NumberFormat().format(repo.stars)} {t('report.stars')}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-ink-muted">{t('report.noRepos')}</p>
      )}
    </ChartCard>
  )
}
