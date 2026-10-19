import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useUserReport } from '../hooks/useUserReport'
import { buildMetrics } from '../lib/metrics'
import { compareMetrics } from '../lib/metrics/duel'
import { normalizeUsername } from '../lib/username'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ChartCard } from '../components/charts/ChartCard'
import { DuelGrid } from '../components/compare/DuelGrid'
import { DuelDial } from '../components/compare/DuelDial'
import { VerdictList } from '../components/compare/VerdictList'
import { ReportSkeleton } from '../components/report/ReportSkeleton'
import { ReportError } from '../components/report/ReportError'

export function Compare() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const nameA = params.get('a') ?? ''
  const nameB = params.get('b') ?? ''

  const queryA = useUserReport(nameA || null)
  const queryB = useUserReport(nameB || null)

  const metricsA = useMemo(
    () => (queryA.data ? buildMetrics(queryA.data) : null),
    [queryA.data],
  )
  const metricsB = useMemo(
    () => (queryB.data ? buildMetrics(queryB.data) : null),
    [queryB.data],
  )

  if (!nameA || !nameB) return <Chooser />

  if (queryA.isError) {
    return <ReportError error={queryA.error} onRetry={() => void queryA.refetch()} />
  }
  if (queryB.isError) {
    return <ReportError error={queryB.error} onRetry={() => void queryB.refetch()} />
  }
  if (!queryA.data || !queryB.data || !metricsA || !metricsB) return <ReportSkeleton />

  const duel = compareMetrics(metricsA, metricsB)
  const sharedDays = duel.days.filter((day) => day.winner === 'tie').length

  return (
    <div className="px-6 py-6">
      <div className="flex flex-wrap items-center gap-6">
        <Identity
          name={queryA.data.profile.login}
          avatar={queryA.data.profile.avatarUrl}
          total={metricsA.calendar.total}
          unit={metricsA.calendar.measure === 'contributions' ? 'contribuciones' : 'pushes'}
        />
        <span className="text-lg font-semibold tracking-tight text-ink-subtle">vs</span>
        <Identity
          name={queryB.data.profile.login}
          avatar={queryB.data.profile.avatarUrl}
          total={metricsB.calendar.total}
          unit={metricsB.calendar.measure === 'contributions' ? 'contributions' : 'pushes'}
        />
      </div>

      <Card className="mt-6">
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-6 py-4">
          <h2 className="text-sm font-semibold text-ink">{t('compare.gridTitle')}</h2>
          <span className="nums text-xs text-ink-muted">
            {sharedDays} {t('compare.daysShared')}
          </span>
        </header>
        <div className="px-6 pt-1 pb-6">
          <DuelGrid
            days={duel.days}
            nameA={queryA.data.profile.login}
            nameB={queryB.data.profile.login}
          />
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-12 items-stretch gap-6">
        <div className="col-span-12 h-full lg:col-span-6">
          <ChartCard title={t('compare.dialTitle')} bodyClassName="flex flex-col justify-center">
            <DuelDial
              countsA={metricsA.hours.counts}
              countsB={metricsB.hours.counts}
              sharedHours={duel.sharedHours}
              nameA={queryA.data.profile.login}
              nameB={queryB.data.profile.login}
            />
            <p className="mt-4 text-center text-sm text-ink-muted">
              {duel.sharedHours.length > 0
                ? t('compare.overlap', { count: duel.sharedHours.length })
                : t('compare.overlapNone')}
            </p>
          </ChartCard>
        </div>

        <div className="col-span-12 h-full lg:col-span-6">
          <ChartCard title={t('compare.verdicts')}>
            <VerdictList
              verdicts={duel.verdicts}
              nameA={queryA.data.profile.login}
              nameB={queryB.data.profile.login}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

function Identity({
  name,
  avatar,
  total,
  unit,
}: {
  name: string
  avatar: string
  total: number
  unit: string
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatar}
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-full border border-line bg-surface-sunken"
      />
      <div>
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="nums text-xs text-ink-muted">
          {new Intl.NumberFormat().format(total)} {unit}
        </p>
      </div>
    </div>
  )
}

function Chooser() {
  const { t } = useI18n()
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const first = normalizeUsername(a)
    const second = normalizeUsername(b)
    if (!first || !second) return
    window.location.assign(`/compare?a=${encodeURIComponent(first)}&b=${encodeURIComponent(second)}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{t('compare.choose')}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t('compare.chooseBody')}</p>

      <form onSubmit={onSubmit} className="mt-8 rounded-card border border-line p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={a}
            onChange={(event) => setA(event.target.value)}
            placeholder={t('compare.placeholderA')}
            aria-label={t('compare.placeholderA')}
            className="h-9 rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            value={b}
            onChange={(event) => setB(event.target.value)}
            placeholder={t('compare.placeholderB')}
            aria-label={t('compare.placeholderB')}
            className="h-9 rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <Button type="submit" variant="primary" className="mt-4" disabled={!a.trim() || !b.trim()}>
          {t('compare.submit')}
        </Button>
      </form>
    </div>
  )
}
