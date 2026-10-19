import type { ReportMetrics } from './types'

export type DuelDay = {
  date: string
  a: number
  b: number
  winner: 'a' | 'b' | 'tie' | 'none'
}

export type Verdict = {
  id: string
  a: number
  b: number
  /** Which side won. `null` when the reading is a tie. */
  winner: 'a' | 'b' | 'tie'
}

export type DuelMetrics = {
  days: DuelDay[]
  /** The hours of the day where both accounts pushed. */
  sharedHours: number[]
  /** Share of A's active hours that B also worked, 0–1. */
  overlapShare: number
  /** The hour where the two rhythms come closest, or `null`. */
  closestHour: number | null
  verdicts: Verdict[]
}

/**
 * Puts two accounts on the same instrument.
 *
 * The days are matched by date, the hours by clock, and every metric becomes a
 * head-to-head verdict. Nothing here is invented: each side is a number that
 * already appears in its own report.
 */
export function compareMetrics(a: ReportMetrics, b: ReportMetrics): DuelMetrics {
  const days = mergeDays(a, b)

  const sharedHours: number[] = []
  for (let hour = 0; hour < 24; hour += 1) {
    if (a.hours.counts[hour] > 0 && b.hours.counts[hour] > 0) sharedHours.push(hour)
  }

  const aActiveHours = a.hours.counts.filter((count) => count > 0).length
  const overlapShare = aActiveHours > 0 ? sharedHours.length / aActiveHours : 0

  return {
    days,
    sharedHours,
    overlapShare,
    closestHour: closestHour(a, b),
    verdicts: buildVerdicts(a, b),
  }
}

function mergeDays(a: ReportMetrics, b: ReportMetrics): DuelDay[] {
  const byDate = new Map<string, DuelDay>()

  for (const day of a.calendar.days) {
    byDate.set(day.date, { date: day.date, a: day.count, b: 0, winner: 'none' })
  }
  for (const day of b.calendar.days) {
    const existing = byDate.get(day.date)
    if (existing) existing.b = day.count
    else byDate.set(day.date, { date: day.date, a: 0, b: day.count, winner: 'none' })
  }

  return [...byDate.values()]
    .map((day) => ({
      ...day,
      winner: day.a > day.b ? ('a' as const) : day.b > day.a ? ('b' as const) : day.a > 0 ? ('tie' as const) : ('none' as const),
    }))
    .sort((first, second) => first.date.localeCompare(second.date))
}

/** The hour where the two rhythms are closest: the smallest gap at the top. */
function closestHour(a: ReportMetrics, b: ReportMetrics): number | null {
  let best: number | null = null
  let bestGap = Number.POSITIVE_INFINITY

  for (let hour = 0; hour < 24; hour += 1) {
    const gap = Math.abs(a.hours.counts[hour] - b.hours.counts[hour])
    if (gap < bestGap) {
      bestGap = gap
      best = hour
    }
  }

  return best
}

function buildVerdicts(a: ReportMetrics, b: ReportMetrics): Verdict[] {
  const verdicts: Verdict[] = [
    {
      id: 'report.totalContributions',
      a: a.calendar.total,
      b: b.calendar.total,
      winner: winnerOf(a.calendar.total, b.calendar.total),
    },
    {
      id: 'report.activeDays',
      a: a.calendar.activeDays,
      b: b.calendar.activeDays,
      winner: winnerOf(a.calendar.activeDays, b.calendar.activeDays),
    },
    {
      id: 'report.longestStreak',
      a: a.streaks.longest,
      b: b.streaks.longest,
      winner: winnerOf(a.streaks.longest, b.streaks.longest),
    },
    {
      id: 'report.totalPushes',
      a: a.hours.total,
      b: b.hours.total,
      winner: winnerOf(a.hours.total, b.hours.total),
    },
    {
      id: 'report.publicRepos',
      a: a.repos.total,
      b: b.repos.total,
      winner: winnerOf(a.repos.total, b.repos.total),
    },
    {
      id: 'report.stars',
      a: a.repos.stars,
      b: b.repos.stars,
      winner: winnerOf(a.repos.stars, b.repos.stars),
    },
  ]

  return verdicts
}

function winnerOf(a: number, b: number): 'a' | 'b' | 'tie' {
  if (a > b) return 'a'
  if (b > a) return 'b'
  return 'tie'
}
