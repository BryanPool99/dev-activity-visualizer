import { useI18n } from '../../i18n'
import { ChartCard } from '../charts/ChartCard'
import type { Profile } from '../../lib/github/types'

type ProfileCardProps = {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const { t } = useI18n()

  const rows: { label: string; value: string }[] = [
    { label: t('report.followers'), value: new Intl.NumberFormat().format(profile.followers) },
    { label: t('report.following'), value: new Intl.NumberFormat().format(profile.following) },
    { label: t('report.publicRepos'), value: new Intl.NumberFormat().format(profile.publicRepos) },
    {
      label: t('report.joined'),
      value: new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
        new Date(profile.createdAt),
      ),
    },
  ]

  if (profile.location) rows.push({ label: t('report.location'), value: profile.location })
  if (profile.company) rows.push({ label: t('report.company'), value: profile.company })
  if (profile.websiteUrl) rows.push({ label: t('report.website'), value: profile.websiteUrl })

  return (
    <ChartCard title={t('report.profile')}>
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className="nums truncate text-sm font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </ChartCard>
  )
}
