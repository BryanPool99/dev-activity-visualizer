import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { normalizeUsername } from '../lib/username'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SearchHero } from '../components/home/SearchHero'
import { RecentReports } from '../components/home/RecentReports'
import { useToken } from '../state/TokenContext'

export function Home() {
  const { t } = useI18n()
  const { hasToken } = useToken()

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{t('app.name')}</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">{t('app.tagline')}</p>
        </div>

        <div className="mt-8">
          <SearchHero />
          <p className="mt-3 text-sm text-ink-muted">
            <Link to="/compare" className="font-medium text-ink underline underline-offset-4">
              {t('home.compareLink')}
            </Link>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-12 items-stretch gap-6">
          <div className="col-span-12 h-full lg:col-span-4">
            <Card className="flex h-full flex-col p-6">
              <h2 className="text-sm font-semibold text-ink">{t('home.contentsTitle')}</h2>
              <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                <li className="border-l-2 border-line pl-3">{t('home.contentsHeatmap')}</li>
                <li className="border-l-2 border-line pl-3">{t('home.contentsHours')}</li>
                <li className="border-l-2 border-line pl-3">{t('home.contentsLanguages')}</li>
                <li className="border-l-2 border-line pl-3">{t('home.contentsStreaks')}</li>
              </ul>
            </Card>
          </div>

          <div className="col-span-12 h-full lg:col-span-4">
            <CompareCard />
          </div>

          <div className="col-span-12 h-full lg:col-span-4">
            {hasToken ? (
              <Card className="flex h-full flex-col p-6">
                <h2 className="text-sm font-semibold text-ink">{t('token.connected')}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {t('home.tokenOn')}
                </p>
              </Card>
            ) : (
              <Card className="flex h-full flex-col p-6">
                <h2 className="text-sm font-semibold text-ink">{t('home.tokenTitle')}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {t('home.tokenBody')}
                </p>
                <p className="mt-4 text-xs text-ink-subtle">{t('token.privacy')}</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12">
          <RecentReports />
        </div>
      </div>
    </div>
  )
}

function CompareCard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const first = normalizeUsername(a)
    const second = normalizeUsername(b)
    if (!first || !second) return
    navigate(`/compare?a=${encodeURIComponent(first)}&b=${encodeURIComponent(second)}`)
  }

  return (
    <Card className="flex h-full flex-col p-6">
      <h2 className="text-sm font-semibold text-ink">{t('compare.title')}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t('home.compareBody')}</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-2">
        <input
          type="text"
          value={a}
          onChange={(event) => setA(event.target.value)}
          placeholder={t('compare.placeholderA')}
          aria-label={t('compare.placeholderA')}
          className="h-9 w-full rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent"
        />
        <input
          type="text"
          value={b}
          onChange={(event) => setB(event.target.value)}
          placeholder={t('compare.placeholderB')}
          aria-label={t('compare.placeholderB')}
          className="h-9 w-full rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent"
        />
        <Button type="submit" variant="primary" className="w-full" disabled={!a.trim() || !b.trim()}>
          {t('compare.submit')}
        </Button>
      </form>
    </Card>
  )
}
