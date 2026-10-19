import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { normalizeUsername } from '../lib/username'
import { Button } from '../components/ui/Button'

export function Home() {
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
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{t('app.name')}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">{t('app.tagline')}</p>
        <p className="mt-6 text-sm text-ink-muted">{t('home.placeholder')}</p>
      </div>

      <form onSubmit={onSubmit} className="mt-10 max-w-2xl rounded-card border border-line p-6">
        <h2 className="text-sm font-semibold text-ink">{t('compare.title')}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={a}
            onChange={(event) => setA(event.target.value)}
            placeholder={t('compare.placeholderA')}
            aria-label={t('compare.placeholderA')}
            className="h-9 flex-1 rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            value={b}
            onChange={(event) => setB(event.target.value)}
            placeholder={t('compare.placeholderB')}
            aria-label={t('compare.placeholderB')}
            className="h-9 flex-1 rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent"
          />
          <Button type="submit" variant="primary" disabled={!a.trim() || !b.trim()}>
            {t('compare.submit')}
          </Button>
        </div>
        <p className="mt-4 text-xs text-ink-subtle">{t('compare.comingSoon')}</p>
      </form>
    </div>
  )
}
