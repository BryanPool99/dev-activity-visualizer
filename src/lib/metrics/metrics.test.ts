import { describe, expect, it } from 'vitest'
import { buildLanguageMetrics } from './languages'
import { buildRepoMetrics } from './repos'
import { buildInsights } from './summary'
import { buildMetrics } from './index'
import type { Repo } from '../github/types'
import type { ReportMetrics } from './types'

function repo(name: string, languages: Repo['languages'], stars = 0): Repo {
  return {
    name,
    fullName: `owner/${name}`,
    description: null,
    url: `https://github.com/owner/${name}`,
    stars,
    forks: 0,
    updatedAt: '2026-01-01T00:00:00Z',
    isFork: false,
    primaryLanguage: null,
    languages,
  }
}

describe('buildLanguageMetrics', () => {
  it('sums bytes per language and computes the share', () => {
    const result = buildLanguageMetrics(
      [
        repo('a', [{ name: 'TypeScript', color: '#9ca3af', bytes: 750 }]),
        repo('b', [{ name: 'TypeScript', color: '#9ca3af', bytes: 250 }]),
        repo('c', [{ name: 'Rust', color: '#2563eb', bytes: 500 }]),
      ],
      'bytes',
    )

    expect(result.measure).toBe('bytes')
    expect(result.total).toBe(1500)
    expect(result.items[0]).toEqual({
      name: 'TypeScript',
      color: '#9ca3af',
      value: 1000,
      share: 1000 / 1500,
    })
  })

  it('counts repositories when that is the measure', () => {
    const result = buildLanguageMetrics(
      [
        repo('a', [{ name: 'Go', color: null, bytes: 0 }]),
        repo('b', [{ name: 'Go', color: null, bytes: 0 }]),
        repo('c', [{ name: 'Python', color: null, bytes: 0 }]),
      ],
      'repositories',
    )

    expect(result.measure).toBe('repositories')
    expect(result.items[0].value).toBe(2)
    expect(result.total).toBe(3)
  })

  it('handles a user with no repositories', () => {
    const result = buildLanguageMetrics([], 'bytes')

    expect(result.items).toEqual([])
    expect(result.total).toBe(0)
  })
})

describe('buildRepoMetrics', () => {
  it('sorts the top repositories by stars', () => {
    const result = buildRepoMetrics([
      repo('low', [], 1),
      repo('high', [], 900),
      repo('mid', [], 40),
    ])

    expect(result.top.map((item) => item.name)).toEqual(['high', 'mid', 'low'])
    expect(result.stars).toBe(941)
  })

  it('keeps the count of repositories the query could not return', () => {
    expect(buildRepoMetrics([], 12).truncated).toBe(12)
  })
})

function metricsWith(overrides: Partial<ReportMetrics>): ReportMetrics {
  const base: ReportMetrics = {
    calendar: { days: [], total: 0, activeDays: 0, windowDays: 0, measure: 'contributions', truncated: false },
    hours: { counts: new Array(24).fill(0), total: 0, peakHour: null, peakShare: 0, phase: 'unknown' },
    weekdays: { counts: new Array(7).fill(0), total: 0, busiest: null, weekendShare: 0 },
    streaks: { current: 0, longest: 0, activeDays: 0 },
    languages: { items: [], total: 0, measure: 'bytes' },
    repos: { total: 0, stars: 0, forks: 0, top: [], truncated: 0 },
    insights: [],
  }
  return { ...base, ...overrides }
}

describe('buildInsights', () => {
  it('says when there is no activity at all', () => {
    const insights = buildInsights(metricsWith({}))

    expect(insights).toHaveLength(1)
    expect(insights[0].key).toBe('insight.no-activity')
  })

  it('flags a partial window when the reading comes from pushes', () => {
    const insights = buildInsights(
      metricsWith({
        calendar: {
          days: [],
          total: 40,
          activeDays: 12,
          windowDays: 30,
          measure: 'pushes',
          truncated: false,
        },
        hours: { counts: new Array(24).fill(0), total: 40, peakHour: 22, peakShare: 0.2, phase: 'night' },
      }),
    )

    expect(insights.map((insight) => insight.key)).toContain('insight.partial-window')
    expect(insights.map((insight) => insight.key)).toContain('insight.night-owl')
  })

  it('says when the feed hit its ceiling', () => {
    const insights = buildInsights(
      metricsWith({
        calendar: {
          days: [],
          total: 40,
          activeDays: 12,
          windowDays: 4,
          measure: 'pushes',
          truncated: true,
        },
        hours: { counts: new Array(24).fill(0), total: 40, peakHour: 9, peakShare: 0.2, phase: 'early' },
      }),
    )

    expect(insights.map((insight) => insight.key)).toContain('insight.partial-truncated')
  })

  it('refuses to read a rhythm out of a handful of marks', () => {
    const insights = buildInsights(
      metricsWith({
        calendar: {
          days: [],
          total: 12,
          activeDays: 4,
          windowDays: 4,
          measure: 'pushes',
          truncated: false,
        },
        hours: { counts: new Array(24).fill(0), total: 12, peakHour: 22, peakShare: 0.2, phase: 'night' },
        weekdays: { counts: new Array(7).fill(0), total: 12, busiest: 5, weekendShare: 0.92 },
      }),
    )

    expect(insights.map((insight) => insight.key)).toContain('insight.too-few-samples')
    expect(insights.map((insight) => insight.key)).not.toContain('insight.weekend')
    expect(insights.map((insight) => insight.key)).not.toContain('insight.night-owl')
  })

  it('refuses a weekday claim from a window shorter than two weeks', () => {
    const insights = buildInsights(
      metricsWith({
        calendar: {
          days: [],
          total: 73,
          activeDays: 4,
          windowDays: 4,
          measure: 'pushes',
          truncated: false,
        },
        hours: { counts: new Array(24).fill(0), total: 73, peakHour: 14, peakShare: 0.2, phase: 'daytime' },
        weekdays: { counts: new Array(7).fill(0), total: 73, busiest: 5, weekendShare: 0.92 },
      }),
    )

    expect(insights.map((insight) => insight.key)).not.toContain('insight.weekend')
    expect(insights.map((insight) => insight.key)).not.toContain('insight.peak-hour')
  })

  it('reads a weekday claim once the window is long enough', () => {
    const insights = buildInsights(
      metricsWith({
        calendar: {
          days: [],
          total: 200,
          activeDays: 40,
          windowDays: 30,
          measure: 'pushes',
          truncated: false,
        },
        hours: { counts: new Array(24).fill(0), total: 200, peakHour: 14, peakShare: 0.2, phase: 'daytime' },
        weekdays: { counts: new Array(7).fill(0), total: 200, busiest: 5, weekendShare: 0.92 },
      }),
    )

    expect(insights.map((insight) => insight.key)).toContain('insight.weekend')
    expect(insights.map((insight) => insight.key)).toContain('insight.peak-hour')
  })

  it('never claims more than four insights', () => {
    const insights = buildInsights(
      metricsWith({
        calendar: {
          days: [],
          total: 900,
          activeDays: 200,
          windowDays: 365,
          measure: 'contributions',
          truncated: false,
        },
        hours: { counts: new Array(24).fill(0), total: 900, peakHour: 23, peakShare: 0.2, phase: 'night' },
        weekdays: { counts: new Array(7).fill(0), total: 900, busiest: 0, weekendShare: 0.8 },
        streaks: { current: 40, longest: 90, activeDays: 200 },
        languages: {
          items: [{ name: 'TypeScript', color: null, value: 900, share: 0.9 }],
          total: 900,
          measure: 'bytes',
        },
        repos: { total: 3, stars: 100, forks: 2, top: [repo('big', [], 100)], truncated: 0 },
      }),
    )

    expect(insights.length).toBeLessThanOrEqual(4)
  })
})

describe('buildMetrics', () => {
  it('assembles every block from the raw payload', () => {
    const metrics = buildMetrics({
      profile: {
        login: 'torvalds',
        name: 'Linus',
        avatarUrl: 'https://example.test/a.png',
        bio: null,
        company: null,
        location: null,
        websiteUrl: null,
        twitterUsername: null,
        followers: 1,
        following: 1,
        publicRepos: 1,
        createdAt: '2011-09-03T00:00:00Z',
      },
      repos: [repo('linux', [{ name: 'C', color: '#555555', bytes: 900 }], 250_000)],
      calendar: [{ date: '2026-01-05', count: 7, weekday: 1 }],
      pushes: [],
      completeness: 'full',
      sources: { profile: 'x', repos: 'x', calendar: 'x', pushes: 'x' },
      measures: { language: 'bytes', contributions: 'contributions' },
    })

    expect(metrics.calendar.total).toBe(7)
    expect(metrics.calendar.measure).toBe('contributions')
    expect(metrics.languages.items[0].name).toBe('C')
    expect(metrics.repos.stars).toBe(250_000)
    expect(metrics.insights.length).toBeGreaterThan(0)
  })
})
