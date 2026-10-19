import { useI18n } from '../../i18n'

type SourceNoteProps = {
  /** The endpoint the numbers came from. */
  source: string
  /** What the numbers count. */
  measure?: 'contributions' | 'pushes' | 'bytes' | 'repositories'
  /** Extra context, e.g. the timezone a chart was bucketed in. */
  detail?: string
}

/**
 * The proof at the foot of every chart: where the numbers came from and what
 * they count. A figure without its source is a claim; this makes it a reading.
 */
export function SourceNote({ source, measure, detail }: SourceNoteProps) {
  const { t } = useI18n()

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
      <span className="label-xs">{t('report.source')}</span>
      <span className="font-medium text-ink-muted">{source}</span>
      {measure ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{t(`report.measure.${measure}`)}</span>
        </>
      ) : null}
      {detail ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{detail}</span>
        </>
      ) : null}
    </p>
  )
}
