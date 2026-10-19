import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { readRecent } from '../../lib/recent'

/** The accounts this browser has already read, one click away. */
export function RecentReports() {
  const { t } = useI18n()
  const recent = readRecent()

  if (recent.length === 0) return null

  return (
    <section>
      <h2 className="label-xs text-ink-subtle">{t('home.recentTitle')}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {recent.map((entry) => (
          <li key={entry.login}>
            <Link
              to={`/u/${encodeURIComponent(entry.login)}`}
              className="flex items-center gap-2 rounded-control border border-line bg-ground py-1.5 pr-3 pl-1.5 text-sm text-ink transition-colors hover:bg-surface"
            >
              <img
                src={entry.avatarUrl}
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-full bg-surface-sunken"
              />
              {entry.name ?? entry.login}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
