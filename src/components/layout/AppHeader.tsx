import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { LanguageToggle } from './LanguageToggle'
import { RateLimitMeter } from './RateLimitMeter'
import { SearchField } from './SearchField'
import { TokenButton } from './TokenButton'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="min-w-0 shrink truncate text-sm font-semibold tracking-tight text-ink"
          aria-label={t('app.name')}
        >
          {t('app.name')}
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center sm:flex">
          {/* The landing page carries the larger search, so the header steps aside. */}
          {isHome ? null : <SearchField />}
        </div>

        <nav className="flex shrink-0 items-center gap-3">
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `hidden text-sm font-medium sm:inline ${
                isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            {t('nav.compare')}
          </NavLink>
          <RateLimitMeter />
          <LanguageToggle />
          <ThemeToggle />
          <TokenButton />
        </nav>
      </div>

      {/* On a phone the search gets its own row, at a size worth typing into. */}
      {isHome ? null : (
        <div className="border-t border-line px-4 py-2 sm:hidden">
          <SearchField />
        </div>
      )}
    </header>
  )
}
