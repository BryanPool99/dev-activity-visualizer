import { useI18n } from '../../i18n'
import type { Verdict } from '../../lib/metrics/duel'

type VerdictListProps = {
  verdicts: Verdict[]
  nameA: string
  nameB: string
}

const numberFormat = new Intl.NumberFormat()

/** The head-to-head, one metric at a time. */
export function VerdictList({ verdicts, nameA, nameB }: VerdictListProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3 text-xs font-medium text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-ink" />
          {nameA}
        </span>
        <span className="flex items-center gap-2">
          {nameB}
          <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-accent" />
        </span>
      </div>

      <ul className="divide-y divide-line">
        {verdicts.map((verdict) => {
          const max = Math.max(verdict.a, verdict.b, 1)
          const label = t(verdict.id)

          return (
            <li key={verdict.id} className="py-4 first:pt-0 last:pb-0">
              <p className="text-sm font-medium text-ink">{label}</p>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="nums w-16 shrink-0 text-right text-sm text-ink">
                  {numberFormat.format(verdict.a)}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className="h-full rounded-full bg-ink"
                      style={{ width: `${(verdict.a / max) * 100}%` }}
                    />
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(verdict.b / max) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="nums w-16 shrink-0 text-sm text-ink">
                  {numberFormat.format(verdict.b)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
