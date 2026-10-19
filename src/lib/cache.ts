import type { RawUserData } from './github/types'

const PREFIX = 'dav.report.'
const TTL_MS = 30 * 60 * 1000

export type CachedReport = {
  data: RawUserData
  savedAt: number
}

function key(username: string, mode: 'graphql' | 'rest'): string {
  return `${PREFIX}${mode}:${username}`
}

/**
 * Reports are remembered in the browser for half an hour. The GitHub API is a
 * shared, free resource, and coming back to a report should not cost a request.
 */
export function readCachedReport(username: string, mode: 'graphql' | 'rest'): CachedReport | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(key(username, mode))
    if (!raw) return null

    const cached = JSON.parse(raw) as CachedReport
    if (!cached?.savedAt || Date.now() - cached.savedAt > TTL_MS) {
      window.localStorage.removeItem(key(username, mode))
      return null
    }
    return cached
  } catch {
    return null
  }
}

export function writeCachedReport(
  username: string,
  mode: 'graphql' | 'rest',
  data: RawUserData,
): void {
  if (typeof window === 'undefined') return

  try {
    const payload: CachedReport = { data, savedAt: Date.now() }
    window.localStorage.setItem(key(username, mode), JSON.stringify(payload))
  } catch {
    // A full or blocked storage is not a reason to fail the report.
  }
}

export function clearCachedReport(username: string, mode: 'graphql' | 'rest'): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key(username, mode))
}
