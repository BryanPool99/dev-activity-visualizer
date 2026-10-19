import { useI18n } from '../../i18n'
import type { Lang } from '../../i18n/dictionary'

const options: Lang[] = ['es', 'en']

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className="flex h-9 items-center rounded-control border border-line p-0.5"
    >
      {options.map((option) => {
        const active = option === lang
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            className={`h-7 rounded-[4px] px-2 text-xs font-medium transition-colors ${
              active ? 'bg-accent-wash text-accent' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {option === 'es' ? t('lang.es') : t('lang.en')}
          </button>
        )
      })}
    </div>
  )
}
