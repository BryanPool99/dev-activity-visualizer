import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { normalizeUsername } from '../lib/username'
import { Button } from '../components/ui/Button'
import { SearchHero } from '../components/home/SearchHero'
import { RecentReports } from '../components/home/RecentReports'
import { useToken } from '../state/TokenContext'

export function Home() {
  const { t } = useI18n()
  const { hasToken } = useToken()

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">{t('app.name')}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('app.tagline')}</p>
        </div>

        <div className="mt-10">
          <SearchHero />
          <p className="mt-4 text-sm text-ink-muted">
            <Link to="/compare" className="font-medium text-ink underline underline-offset-4">
              {t('home.compareLink')}
            </Link>
          </p>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-10 border-t border-line pt-10">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="text-base font-semibold text-ink">{t('compare.title')}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              {t('home.compareBody')}
            </p>
            <CompareForm />
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-line lg:pl-10">
            <h2 className="text-base font-semibold text-ink">
              {hasToken ? t('token.connected') : t('home.tokenTitle')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {hasToken ? t('home.tokenOn') : t('home.tokenBody')}
            </p>
            <p className="mt-3 text-xs text-ink-subtle">{t('token.privacy')}</p>
          </div>
        </div>

        <div className="mt-16">
          <RecentReports />
        </div>

        <p className="mt-16 border-t border-line pt-6 text-sm text-ink-subtle">
          {t('home.contentsHeatmap')} · {t('home.contentsHours')} ·{' '}
          {t('home.contentsLanguages')} · {t('home.contentsStreaks')}
        </p>
      </div>
    </div>
  )
}

function CompareForm() {
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
    <form onSubmit={onSubmit} className="mt-5 flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={a}
        onChange={(event) => setA(event.target.value)}
        placeholder={t('compare.placeholderA')}
        aria-label={t('compare.placeholderA')}
        className="h-9 w-40 rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent sm:w-44"
      />
      <input
        type="text"
        value={b}
        onChange={(event) => setB(event.target.value)}
        placeholder={t('compare.placeholderB')}
        aria-label={t('compare.placeholderB')}
        className="h-9 w-40 rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent sm:w-44"
      />
      <Button type="submit" variant="primary" disabled={!a.trim() || !b.trim()}>
        {t('compare.submit')}
      </Button>
    </form>
  )
}
