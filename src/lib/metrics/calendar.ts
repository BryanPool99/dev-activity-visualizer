import type { CalendarDay, PushRecord } from '../github/types'
import { addDays, dateRange, toDateKey, todayKey, weekdayOf } from './dates'
import type { CalendarMetrics, DayCount, StreakMetrics } from './types'

/** One mark per day, from the push feed, in the reader's local time. */
export function daysFromPushes(pushes: PushRecord[]): DayCount[] {
  const counts = new Map<string, number>()

  for (const push of pushes) {
    const key = toDateKey(new Date(push.timestamp))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count, weekday: weekdayOf(date) }))
}

/**
 * The push days with the quiet days in between filled in, so the calendar reads
 * as a continuous run of days rather than a list of the days that happened.
 */
export function fillQuietDays(days: DayCount[]): DayCount[] {
  if (days.length === 0) return []

  const counts = new Map(days.map((day) => [day.date, day.count]))
  const first = days[0].date
  const last = days[days.length - 1].date

  return dateRange(first, last).map((date) => ({
    date,
    count: counts.get(date) ?? 0,
    weekday: weekdayOf(date),
  }))
}

function fromCalendarDays(days: CalendarDay[]): DayCount[] {
  return days
    .map((day) => ({ date: day.date, count: day.count, weekday: day.weekday }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * The day-by-day series the heatmap draws.
 *
 * With a token this is GitHub's own contribution calendar. Without one it is
 * built from the public push feed, which covers a shorter and sometimes
 * truncated window — the calendar says so rather than pretending.
 */
export function buildCalendar(
  calendar: CalendarDay[] | null,
  pushes: PushRecord[],
  options: { truncated?: boolean } = {},
): CalendarMetrics {
  const measure = calendar ? ('contributions' as const) : ('pushes' as const)
  const days = calendar
    ? fromCalendarDays(calendar)
    : fillQuietDays(daysFromPushes(pushes))

  const total = days.reduce((sum, day) => sum + day.count, 0)
  const activeDays = days.filter((day) => day.count > 0).length

  const windowDays = days.length > 0 ? days.length : 0

  return {
    days,
    total,
    activeDays,
    windowDays,
    measure,
    truncated: Boolean(options.truncated),
  }
}

/**
 * The longest run of consecutive active days, and the run that reaches today.
 *
 * A streak is broken by a day without activity, so the series is walked day by
 * day from the first record to today rather than counted over the records.
 */
export function computeStreaks(days: DayCount[]): StreakMetrics {
  if (days.length === 0) return { current: 0, longest: 0, activeDays: 0 }

  const counts = new Map(days.map((day) => [day.date, day.count]))
  const first = days[0].date
  const today = todayKey()

  // A series that starts after today (clock skew, future data) contributes nothing.
  if (first > today) return { current: 0, longest: 0, activeDays: days.length }

  let longest = 0
  let running = 0

  for (const date of dateRange(first, today)) {
    if ((counts.get(date) ?? 0) > 0) {
      running += 1
      if (running > longest) longest = running
    } else {
      running = 0
    }
  }

  // The current streak only counts if it reaches today.
  let current = 0
  let cursor = today
  while ((counts.get(cursor) ?? 0) > 0) {
    current += 1
    cursor = addDays(cursor, -1)
  }

  return { current, longest, activeDays: days.filter((day) => day.count > 0).length }
}
