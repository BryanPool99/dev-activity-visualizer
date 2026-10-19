import { useI18n } from '../../i18n'
import { useRateLimit } from '../../state/RateLimitContext'

function formatReset(resetAt: number, now: number): string {
  const minutes = Math.max(0, Math.round((resetAt - now) / 60000))
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.round(minutes / 60)
  return `${hours}h`
}

export function RateLimitMeter() {
  const { t } = useI18n()
  const { rateLimit } = useRateLimit()

  if (!rateLimit) {
    return (
      <span className="hidden items-center gap-1.5 text-xs text-ink-subtle md:inline-flex">
        <span className="size-1.5 rounded-full bg-line-strong" />
        {t('rate.idle')}
      </span>
    )
  }

  const ratio = rateLimit.limit > 0 ? rateLimit.remaining / rateLimit.limit : 0
  const tone = ratio > 0.5 ? 'bg-emerald-500' : ratio > 0.15 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <span
      className="hidden items-center gap-1.5 text-xs text-ink-muted md:inline-flex"
      title={`${rateLimit.remaining} / ${rateLimit.limit}`}
    >
      <span className={`size-1.5 rounded-full ${tone}`} />
      <span className="nums">
        {rateLimit.remaining}/{rateLimit.limit}
      </span>
      <span className="text-ink-subtle">· {formatReset(rateLimit.resetAt, Date.now())}</span>
    </span>
  )
}
