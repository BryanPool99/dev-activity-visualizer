import type { ReportMetrics } from './types'
import type { Insight } from './types'

/**
 * The facts worth saying out loud.
 *
 * Every insight is read off a number that is already on screen — nothing is
 * estimated, and nothing is said about a person beyond what their own data
 * shows. The copy lives in the dictionary, keyed by `insight.*`.
 */
/**
 * The smallest sample that can carry a claim about a rhythm. Below this, the
 * data is shown but not interpreted.
 */
export const MIN_SAMPLE = 20

/** Days of coverage needed before a claim about the hour of the day. */
export const MIN_HOURS_WINDOW = 7

/** Days of coverage needed before a claim about the days of the week. */
export const MIN_WEEKDAY_WINDOW = 14

export function buildInsights(metrics: ReportMetrics): Insight[] {
  const insights: Insight[] = []
  const { calendar, hours, weekdays, streaks, languages, repos } = metrics

  if (calendar.total === 0) {
    insights.push({ key: 'insight.no-activity', params: {} })
    return insights
  }

  if (calendar.measure === 'pushes') {
    insights.push({
      key: calendar.truncated ? 'insight.partial-truncated' : 'insight.partial-window',
      params: { days: calendar.windowDays },
    })
  }

  // A rhythm cannot be read out of a handful of marks.
  if (hours.total < MIN_SAMPLE) {
    insights.push({ key: 'insight.too-few-samples', params: { count: hours.total } })
    return insights.slice(0, 4)
  }

  // Nor out of a window too short to have a shape: four days of a weekend say
  // nothing about a week.
  if (hours.peakHour !== null && calendar.windowDays >= MIN_HOURS_WINDOW) {
    if (hours.phase === 'night') {
      insights.push({ key: 'insight.night-owl', params: { hour: hours.peakHour } })
    } else if (hours.phase === 'early') {
      insights.push({ key: 'insight.early-bird', params: { hour: hours.peakHour } })
    } else {
      insights.push({ key: 'insight.peak-hour', params: { hour: hours.peakHour } })
    }
  }

  if (weekdays.weekendShare >= 0.4 && calendar.windowDays >= MIN_WEEKDAY_WINDOW) {
    insights.push({
      key: 'insight.weekend',
      params: { share: Math.round(weekdays.weekendShare * 100) },
    })
  }

  if (streaks.longest >= 3) {
    insights.push({ key: 'insight.longest-streak', params: { days: streaks.longest } })
  }

  const topLanguage = languages.items[0]
  if (topLanguage && topLanguage.share >= 0.3) {
    insights.push({
      key: 'insight.top-language',
      params: { name: topLanguage.name, share: Math.round(topLanguage.share * 100) },
    })
  }

  const topRepo = repos.top[0]
  if (topRepo && topRepo.stars > 0) {
    insights.push({ key: 'insight.top-repo', params: { name: topRepo.name, stars: topRepo.stars } })
  }

  return insights.slice(0, 4)
}
