import { useI18n } from '../../i18n'
import { CONTRIBUTION_SCALE } from '../../lib/charts/scale'

type ContributionLegendProps = {
  palette?: readonly string[]
}

/** The five steps of the contribution scale, from nothing to the busiest day. */
export function ContributionLegend({ palette = CONTRIBUTION_SCALE }: ContributionLegendProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink-subtle">{t('report.legend.less')}</span>
      {palette.map((color) => (
        <span
          key={color}
          aria-hidden="true"
          className="size-2.5 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
      ))}
      <span className="text-xs text-ink-subtle">{t('report.legend.more')}</span>
    </div>
  )
}
