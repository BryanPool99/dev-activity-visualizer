import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { LanguageToggle } from './LanguageToggle'
import { RateLimitMeter } from './RateLimitMeter'
import { SearchField } from './SearchField'
import { TokenButton } from './TokenButton'

export function AppHeader() {
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
        <Link
          to="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-ink"
          aria-label={t('app.name')}
        >
          {t('app.name')}
        </Link>

        <div className="flex min-w-0 flex-1 justify-center">
          <SearchField />
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
          <TokenButton />
        </nav>
      </div>
    </header>
  )
}
