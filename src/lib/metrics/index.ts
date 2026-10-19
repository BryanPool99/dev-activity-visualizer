import { buildCalendar, computeStreaks } from './calendar'
import { buildHourHistogram, buildWeekdayHistogram } from './hours'
import { buildLanguageMetrics } from './languages'
import { buildRepoMetrics } from './repos'
import { buildInsights } from './summary'
import type { ReportMetrics } from './types'
import type { RawUserData } from '../github/types'

/**
 * Turns the raw API payloads into every number the report shows. The functions
 * here are pure, so they can be tested without a network or a browser.
 */
export function buildMetrics(raw: RawUserData): ReportMetrics {
  const calendar = buildCalendar(raw.calendar, raw.pushes, { truncated: raw.pushesTruncated })
  const streaks = computeStreaks(calendar.days)
  const hours = buildHourHistogram(raw.pushes)
  const weekdays = buildWeekdayHistogram(raw.pushes)
  const languages = buildLanguageMetrics(raw.repos, raw.measures.language)
  const repos = buildRepoMetrics(raw.repos, raw.truncatedRepos)

  const metrics: ReportMetrics = {
    calendar,
    hours,
    weekdays,
    streaks,
    languages,
    repos,
    insights: [],
  }

  metrics.insights = buildInsights(metrics)
  return metrics
}

export * from './types'
export { buildCalendar, computeStreaks, daysFromPushes } from './calendar'
export { buildHourHistogram, buildWeekdayHistogram, phaseOf } from './hours'
export { buildLanguageMetrics } from './languages'
export { buildRepoMetrics } from './repos'
export { buildInsights } from './summary'
export { addDays, dateRange, daysBetween, mondayFirstIndex, toDateKey, todayKey, weekdayOf } from './dates'
