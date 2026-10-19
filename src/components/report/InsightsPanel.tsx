import { useI18n } from '../../i18n'
import { Card } from '../ui/Card'
import type { Insight } from '../../lib/metrics/types'

type InsightsPanelProps = {
  insights: Insight[]
}

/**
 * The findings, in plain words. Every line is read off a number that is
 * already on the page, and the panel says nothing the charts do not show.
 */
export function InsightsPanel({ insights }: InsightsPanelProps) {
  const { t } = useI18n()

  if (insights.length === 0) return null

  return (
    <Card className="h-full">
      <header className="px-6 py-4">
        <h2 className="text-sm font-semibold text-ink">{t('report.insights')}</h2>
      </header>
      <ul className="border-t border-line">
        {insights.map((insight) => (
          <li
            key={insight.key}
            className="flex items-start gap-3 border-b border-line px-6 py-3 last:border-b-0"
          >
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-subtle" />
            <p className="text-sm leading-relaxed text-ink">{t(insight.key, insight.params)}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
