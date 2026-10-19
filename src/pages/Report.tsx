import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useUserReport } from '../hooks/useUserReport'
import { buildMetrics } from '../lib/metrics'
import { rememberAccount } from '../lib/recent'
import { IdentityBand } from '../components/report/IdentityBand'
import { ReportLede } from '../components/report/ReportLede'
import { ContributionCard } from '../components/report/ContributionCard'
import { InsightsPanel } from '../components/report/InsightsPanel'
import { LanguageCard } from '../components/report/LanguageCard'
import { HoursCard } from '../components/report/HoursCard'
import { WeekdayCard } from '../components/report/WeekdayCard'
import { RepositoriesCard } from '../components/report/RepositoriesCard'
import { ProfileCard } from '../components/report/ProfileCard'
import { SourcesCard } from '../components/report/SourcesCard'
import { ReportSkeleton } from '../components/report/ReportSkeleton'
import { ReportError } from '../components/report/ReportError'
import { TokenPrompt } from '../components/report/TokenPrompt'

export function Report() {
  const { username = '' } = useParams()
  const { t } = useI18n()
  const query = useUserReport(username)

  const metrics = useMemo(
    () => (query.data ? buildMetrics(query.data) : null),
    [query.data],
  )

  // The account is remembered in this browser, and only here.
  useEffect(() => {
    if (!query.data) return
    rememberAccount({
      login: query.data.profile.login,
      name: query.data.profile.name,
      avatarUrl: query.data.profile.avatarUrl,
    })
  }, [query.data])

  if (query.isError) {
    return <ReportError error={query.error} onRetry={() => void query.refetch()} />
  }
  if (query.isPending || !metrics) return <ReportSkeleton />

  const { profile, sources, completeness } = query.data

  return (
    // One authored entrance for the whole report, and nothing else moving.
    <div className="rise px-6 py-6">
      <IdentityBand profile={profile} metrics={metrics} />

      <ReportLede metrics={metrics} />

      {completeness === 'partial' ? (
        <div className="mt-6">
          <TokenPrompt days={metrics.calendar.windowDays} />
        </div>
      ) : null}

      <div className="mt-6">
        <ContributionCard
          name={profile.login}
          metrics={metrics}
          source={sources.calendar}
        />
      </div>

      <div className="mt-6 grid grid-cols-12 items-stretch gap-6">
        <div className="col-span-12 h-full lg:col-span-5">
          <InsightsPanel insights={metrics.insights} />
        </div>
        <div className="col-span-12 h-full lg:col-span-7">
          <LanguageCard metrics={metrics} source={sources.repos} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 items-stretch gap-6">
        <div className="col-span-12 h-full lg:col-span-4">
          <HoursCard name={profile.login} metrics={metrics} source={sources.pushes} />
        </div>
        <div className="col-span-12 h-full lg:col-span-4">
          <WeekdayCard name={profile.login} metrics={metrics} source={sources.pushes} />
        </div>
        <div className="col-span-12 h-full lg:col-span-4">
          <RepositoriesCard metrics={metrics} source={sources.repos} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 items-stretch gap-6">
        <div className="col-span-12 h-full lg:col-span-4">
          <ProfileCard profile={profile} />
        </div>
        <div className="col-span-12 h-full lg:col-span-8">
          <SourcesCard data={query.data} />
        </div>
      </div>

      <footer className="mt-8 border-t border-line pt-5">
        <p className="text-xs text-ink-subtle">
          {t('app.name')} · {t('report.source')}: {sources.profile}
        </p>
      </footer>
    </div>
  )
}
