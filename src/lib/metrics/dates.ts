/** Date keys are `YYYY-MM-DD`. Everything here works on the key, not on a Date. */

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(key: string): { year: number; month: number; day: number } {
  const [year, month, day] = key.split('-').map(Number)
  return { year, month, day }
}

/** Adds days to a date key. UTC arithmetic keeps it stable across DST changes. */
export function addDays(key: string, days: number): string {
  const { year, month, day } = parseDateKey(key)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** 0 = Sunday, matching GitHub's own grid. */
export function weekdayOf(key: string): number {
  const { year, month, day } = parseDateKey(key)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

/** 0 = Monday, the order a week is read in. */
export function mondayFirstIndex(key: string): number {
  return (weekdayOf(key) + 6) % 7
}

export function daysBetween(from: string, to: string): number {
  const a = parseDateKey(from)
  const b = parseDateKey(to)
  const start = Date.UTC(a.year, a.month - 1, a.day)
  const end = Date.UTC(b.year, b.month - 1, b.day)
  return Math.round((end - start) / 86_400_000)
}

/** Every date key between two dates, inclusive. */
export function dateRange(from: string, to: string): string[] {
  const keys: string[] = []
  let cursor = from
  let guard = 0
  while (cursor <= to && guard < 4000) {
    keys.push(cursor)
    cursor = addDays(cursor, 1)
    guard += 1
  }
  return keys
}

export function todayKey(): string {
  return toDateKey(new Date())
}
