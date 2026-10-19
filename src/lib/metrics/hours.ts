import type { PushRecord } from '../github/types'
import { mondayFirstIndex } from './dates'
import type { HourMetrics, WeekdayMetrics } from './types'

/**
 * The 24 hours of the day, in the reader's own timezone.
 *
 * The push feed reports UTC timestamps and GitHub does not publish a user's
 * timezone, so the reading is local to whoever is looking. The chart says which
 * offset it used.
 */
export function buildHourHistogram(pushes: PushRecord[]): HourMetrics {
  const counts = new Array<number>(24).fill(0)
  let total = 0

  for (const push of pushes) {
    const date = new Date(push.timestamp)
    if (Number.isNaN(date.getTime())) continue
    counts[date.getHours()] += 1
    total += 1
  }

  let peakHour: number | null = null
  let peakCount = 0
  counts.forEach((count, hour) => {
    if (count > peakCount) {
      peakCount = count
      peakHour = hour
    }
  })

  return {
    counts,
    total,
    peakHour,
    peakShare: total > 0 ? peakCount / total : 0,
    phase: phaseOf(peakHour, total),
  }
}

/** When the peak hour sits, as a reading of a working rhythm. */
export function phaseOf(
  peakHour: number | null,
  total: number,
): HourMetrics['phase'] {
  if (peakHour === null || total === 0) return 'unknown'
  if (peakHour >= 5 && peakHour <= 11) return 'early'
  if (peakHour >= 12 && peakHour <= 17) return 'daytime'
  if (peakHour >= 18 && peakHour <= 23) return 'evening'
  return 'night'
}

/** The seven days of the week, Monday first, in the reader's own timezone. */
export function buildWeekdayHistogram(pushes: PushRecord[]): WeekdayMetrics {
  const counts = new Array<number>(7).fill(0)
  let total = 0

  for (const push of pushes) {
    const date = new Date(push.timestamp)
    if (Number.isNaN(date.getTime())) continue
    counts[mondayFirstIndex(toLocalKey(date))] += 1
    total += 1
  }

  let busiest: number | null = null
  let busiestCount = 0
  counts.forEach((count, index) => {
    if (count > busiestCount) {
      busiestCount = count
      busiest = index
    }
  })

  const weekend = counts[5] + counts[6]

  return {
    counts,
    total,
    busiest,
    weekendShare: total > 0 ? weekend / total : 0,
  }
}

function toLocalKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
