import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { normalizeUsername } from '../../lib/username'

export function SearchField({ autoFocus = false }: { autoFocus?: boolean }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const username = normalizeUsername(value)
    if (!username) return
    navigate(`/u/${encodeURIComponent(username)}`)
  }

  return (
    <form onSubmit={onSubmit} role="search" className="w-full max-w-xs">
      <div className="flex h-9 items-center gap-2 rounded-control border border-line bg-ground px-3 focus-within:border-accent">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-4 shrink-0 text-ink-subtle"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.aria')}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
        />
      </div>
    </form>
  )
}
