export type Profile = {
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  company: string | null
  location: string | null
  websiteUrl: string | null
  twitterUsername: string | null
  followers: number
  following: number
  publicRepos: number
  createdAt: string
}

export type Language = {
  name: string
  /** GitHub's own hex colour for the language, e.g. `#3178c6`. */
  color: string | null
  /** Bytes of code in that language. Zero when the source only knew the primary language. */
  bytes: number
}

export type Repo = {
  name: string
  fullName: string
  description: string | null
  url: string
  stars: number
  forks: number
  updatedAt: string
  isFork: boolean
  primaryLanguage: { name: string; color: string | null } | null
  languages: Language[]
}

export type CalendarDay = {
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  count: number
  /** 0 = Sunday, matching GitHub's own grid. */
  weekday: number
}

/**
 * One push, flattened out of a public `PushEvent`.
 *
 * The public event feed no longer carries the commit list — the payload holds
 * only the ref, the head sha and the push id — so the timestamp of the event is
 * the moment of the push, and the number of commits inside it is unknown.
 */
export type PushRecord = {
  repo: string
  /** ISO timestamp of the push. */
  timestamp: string
  ref: string
  head: string
}

/**
 * How much of the year the data actually covers.
 * - `full`   the GraphQL contribution calendar, a whole year.
 * - `partial` the ~90 days of public events, the unauthenticated ceiling.
 */
export type Completeness = 'full' | 'partial'

/** Everything the report needs, before any metric is derived from it. */
export type RawUserData = {
  profile: Profile
  repos: Repo[]
  /** `null` when no token: the contribution calendar needs GraphQL. */
  calendar: CalendarDay[] | null
  /** Public push events. The only source of time-of-day activity without a token. */
  pushes: PushRecord[]
  completeness: Completeness
  /** The endpoint each block came from, printed under the chart that uses it. */
  sources: Record<'profile' | 'repos' | 'calendar' | 'pushes', string>
  /**
   * What each chart is actually measuring. The language reading changes with the
   * data we can reach, and the interface says which one it is showing.
   */
  measures: {
    language: 'bytes' | 'repositories'
    contributions: 'contributions' | 'pushes'
  }
  /** Owned repositories GitHub holds that the query could not return. */
  truncatedRepos?: number
  /**
   * The real window the push feed covers, in days. The feed keeps about 90 days
   * and stops at 300 events, so the window is often shorter than 90.
   */
  pushWindowDays?: number
  /** `true` when the feed hit its 300-event ceiling and the sample is partial. */
  pushesTruncated?: boolean
}
