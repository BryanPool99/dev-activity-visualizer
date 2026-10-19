import { useI18n } from '../../i18n'
import { contributionFill } from '../../lib/charts/scale'

/** The five steps of the contribution scale, from nothing to the busiest day. */
export function ContributionLegend() {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink-subtle">{t('report.legend.less')}</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <span
          key={level}
          aria-hidden="true"
          className="size-2.5 rounded-[2px]"
          style={{ backgroundColor: contributionFill(level) }}
        />
      ))}
      <span className="text-xs text-ink-subtle">{t('report.legend.more')}</span>
    </div>
  )
}
