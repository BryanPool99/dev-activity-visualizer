import { describe, expect, it } from 'vitest'
import { compareMetrics } from './duel'
import type { ReportMetrics } from './types'

function metricsWith(overrides: Partial<ReportMetrics>): ReportMetrics {
  return {
    calendar: { days: [], total: 0, activeDays: 0, windowDays: 0, measure: 'contributions', truncated: false },
    hours: { counts: new Array(24).fill(0), total: 0, peakHour: null, peakShare: 0, phase: 'unknown' },
    weekdays: { counts: new Array(7).fill(0), total: 0, busiest: null, weekendShare: 0 },
    streaks: { current: 0, longest: 0, activeDays: 0 },
    languages: { items: [], total: 0, measure: 'bytes' },
    repos: { total: 0, stars: 0, forks: 0, top: [], truncated: 0 },
    insights: [],
    ...overrides,
  }
}

function day(date: string, count: number) {
  return { date, count, weekday: 0 }
}

describe('compareMetrics', () => {
  it('matches the days of both accounts by date', () => {
    const a = metricsWith({
      calendar: {
        days: [day('2026-01-05', 3), day('2026-01-06', 0)],
        total: 3,
        activeDays: 1,
        windowDays: 2,
        measure: 'contributions',
        truncated: false,
      },
    })
    const b = metricsWith({
      calendar: {
        days: [day('2026-01-05', 1), day('2026-01-06', 5)],
        total: 6,
        activeDays: 2,
        windowDays: 2,
        measure: 'contributions',
        truncated: false,
      },
    })

    const duel = compareMetrics(a, b)

    expect(duel.days).toHaveLength(2)
    expect(duel.days[0]).toEqual({ date: '2026-01-05', a: 3, b: 1, winner: 'a' })
    expect(duel.days[1]).toEqual({ date: '2026-01-06', a: 0, b: 5, winner: 'b' })
  })

  it('calls a day with the same count a tie', () => {
    const a = metricsWith({
      calendar: {
        days: [day('2026-01-05', 2)],
        total: 2,
        activeDays: 1,
        windowDays: 1,
        measure: 'contributions',
        truncated: false,
      },
    })
    const b = metricsWith({
      calendar: {
        days: [day('2026-01-05', 2)],
        total: 2,
        activeDays: 1,
        windowDays: 1,
        measure: 'contributions',
        truncated: false,
      },
    })

    expect(compareMetrics(a, b).days[0].winner).toBe('tie')
  })

  it('finds the hours both accounts were active', () => {
    const countsA = new Array<number>(24).fill(0)
    countsA[9] = 3
    countsA[14] = 1
    const countsB = new Array<number>(24).fill(0)
    countsB[9] = 2
    countsB[20] = 4

    const duel = compareMetrics(
      metricsWith({ hours: { counts: countsA, total: 4, peakHour: 9, peakShare: 0.75, phase: 'early' } }),
      metricsWith({ hours: { counts: countsB, total: 6, peakHour: 20, peakShare: 0.66, phase: 'evening' } }),
    )

    expect(duel.sharedHours).toEqual([9])
    expect(duel.overlapShare).toBeCloseTo(0.5)
  })

  it('builds a verdict for every head-to-head metric', () => {
    const duel = compareMetrics(metricsWith({}), metricsWith({}))

    expect(duel.verdicts.length).toBeGreaterThan(0)
    for (const verdict of duel.verdicts) {
      expect(['a', 'b', 'tie']).toContain(verdict.winner)
    }
  })

  it('names the winner of a metric', () => {
    const a = metricsWith({
      calendar: {
        days: [],
        total: 50,
        activeDays: 10,
        windowDays: 10,
        measure: 'contributions',
        truncated: false,
      },
    })
    const b = metricsWith({
      calendar: {
        days: [],
        total: 20,
        activeDays: 4,
        windowDays: 10,
        measure: 'contributions',
        truncated: false,
      },
    })

    const duel = compareMetrics(a, b)
    const contributions = duel.verdicts.find((v) => v.id === 'report.totalContributions')

    expect(contributions?.winner).toBe('a')
  })
})
