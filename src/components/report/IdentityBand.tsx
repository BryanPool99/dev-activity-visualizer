import { useI18n } from '../../i18n'
import { StatTile } from '../ui/StatTile'
import type { Profile } from '../../lib/github/types'
import type { ReportMetrics } from '../../lib/metrics/types'

type IdentityBandProps = {
  profile: Profile
  metrics: ReportMetrics
}

/** Who this is, and the three numbers that frame everything below. */
export function IdentityBand({ profile, metrics }: IdentityBandProps) {
  const { t } = useI18n()

  const totalLabel =
    metrics.calendar.measure === 'contributions'
      ? t('report.totalContributions')
      : t('report.totalPushes')

  const peak = metrics.hours.peakHour

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
      <img
        src={profile.avatarUrl}
        alt=""
        width={64}
        height={64}
        className="size-16 shrink-0 rounded-full border border-line bg-surface-sunken"
      />

      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          {profile.name ?? profile.login}
        </h1>
        <p className="text-sm text-ink-muted">@{profile.login}</p>
        {profile.bio ? (
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted">{profile.bio}</p>
        ) : null}
      </div>

      <dl className="ml-auto grid w-full grid-cols-3 divide-x divide-line sm:flex sm:w-auto sm:items-stretch">
        <StatTile
          size="lead"
          label={totalLabel}
          value={new Intl.NumberFormat().format(metrics.calendar.total)}
          hint={t('report.activeDays') + ': ' + metrics.calendar.activeDays}
        />
        <StatTile
          label={t('report.currentStreak')}
          value={String(metrics.streaks.current)}
          hint={t('report.longestStreak') + ': ' + metrics.streaks.longest}
        />
        <StatTile
          label={t('report.peakHourValue')}
          value={peak === null ? '—' : `${String(peak).padStart(2, '0')}:00`}
          hint={t('report.hoursHint')}
        />
      </dl>
    </div>
  )
}
