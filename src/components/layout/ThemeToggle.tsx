import { useTheme } from '../../state/ThemeContext'
import { useI18n } from '../../i18n'

/** Flips between the light and the dark reading of the same instrument. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}
      title={isDark ? t('theme.toLight') : t('theme.toDark')}
      className="inline-flex size-9 items-center justify-center rounded-control border border-line bg-ground text-ink-muted transition-colors hover:bg-surface hover:text-ink"
    >
      {isDark ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 2v1.5M10 16.5V18M18 10h-1.5M3.5 10H2M15.7 4.3l-1 1M5.3 14.7l-1 1M15.7 15.7l-1-1M5.3 5.3l-1-1" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" />
        </svg>
      )}
    </button>
  )
}
