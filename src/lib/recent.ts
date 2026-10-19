const KEY = 'dav.recent'
const LIMIT = 6

export type RecentEntry = {
  login: string
  name: string | null
  avatarUrl: string
  visitedAt: number
}

/**
 * The accounts this browser has looked at. It never leaves the device, and it
 * is what the landing page offers back to whoever comes back.
 */
export function readRecent(): RecentEntry[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const entries = JSON.parse(raw) as RecentEntry[]
    if (!Array.isArray(entries)) return []
    return entries.filter((entry) => entry?.login).slice(0, LIMIT)
  } catch {
    return []
  }
}

export function rememberAccount(entry: Omit<RecentEntry, 'visitedAt'>) {
  if (typeof window === 'undefined') return

  try {
    const existing = readRecent().filter((item) => item.login !== entry.login)
    const next = [{ ...entry, visitedAt: Date.now() }, ...existing].slice(0, LIMIT)
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // A blocked storage is not a reason to fail a report.
  }
}
