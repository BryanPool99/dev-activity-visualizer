import type { TranslationKey } from '../../i18n/dictionary'
import type { Repo } from '../github/types'

export type DayCount = {
  /** `YYYY-MM-DD` in the reader's local time. */
  date: string
  count: number
  /** 0 = Sunday, matching GitHub's own grid. */
  weekday: number
}

export type CalendarMetrics = {
  days: DayCount[]
  total: number
  activeDays: number
  /** The span actually covered, in days. */
  windowDays: number
  /** What a count means: GitHub's contributions, or one mark per push. */
  measure: 'contributions' | 'pushes'
  /** `true` when the source hit a ceiling and the sample is incomplete. */
  truncated: boolean
}

export type HourMetrics = {
  /** 24 buckets, index 0 = 00:00 local time. */
  counts: number[]
  total: number
  peakHour: number | null
  /** Share of the activity that lands on the peak hour, 0–1. */
  peakShare: number
  phase: 'early' | 'daytime' | 'evening' | 'night' | 'unknown'
}

export type WeekdayMetrics = {
  /** 7 buckets, index 0 = Monday. */
  counts: number[]
  total: number
  /** Index of the busiest weekday, 0 = Monday. */
  busiest: number | null
  /** Share of the activity that lands on a weekend, 0–1. */
  weekendShare: number
}

export type StreakMetrics = {
  /** Consecutive active days ending today. */
  current: number
  /** Longest run of consecutive active days in the window. */
  longest: number
  activeDays: number
}

export type LanguageSlice = {
  name: string
  color: string | null
  value: number
  /** Share of the total, 0–1. */
  share: number
}

export type LanguageMetrics = {
  items: LanguageSlice[]
  total: number
  /** Bytes of code, or number of repositories. */
  measure: 'bytes' | 'repositories'
}

export type RepoMetrics = {
  total: number
  stars: number
  forks: number
  top: Repo[]
  /** Owned repositories the query could not return. */
  truncated: number
}

/** A fact read off the data. The copy lives in the dictionary, not here. */
export type Insight = {
  key: TranslationKey
  params: Record<string, string | number>
}

export type ReportMetrics = {
  calendar: CalendarMetrics
  hours: HourMetrics
  weekdays: WeekdayMetrics
  streaks: StreakMetrics
  languages: LanguageMetrics
  repos: RepoMetrics
  insights: Insight[]
}
