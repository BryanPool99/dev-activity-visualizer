import { describe, expect, it } from 'vitest'
import { buildCalendar, computeStreaks, daysFromPushes, fillQuietDays } from './calendar'
import { addDays, dateRange, daysBetween, mondayFirstIndex, weekdayOf } from './dates'
import type { DayCount } from './types'
import type { PushRecord } from '../github/types'

function push(timestamp: string): PushRecord {
  return { repo: 'owner/repo', timestamp, ref: 'refs/heads/main', head: 'abc123' }
}

function day(date: string, count: number): DayCount {
  return { date, count, weekday: weekdayOf(date) }
}

describe('date helpers', () => {
  it('adds days across a month boundary', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
  })

  it('adds days across a leap day', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
  })

  it('subtracts days', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('counts the days between two dates', () => {
    expect(daysBetween('2026-01-01', '2026-01-31')).toBe(30)
  })

  it('builds an inclusive range', () => {
    expect(dateRange('2026-01-01', '2026-01-04')).toEqual([
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
      '2026-01-04',
    ])
  })

  it('maps Sunday to 0 and Monday to 1', () => {
    expect(weekdayOf('2026-01-04')).toBe(0)
    expect(weekdayOf('2026-01-05')).toBe(1)
  })

  it('maps Monday to index 0 in the Monday-first order', () => {
    expect(mondayFirstIndex('2026-01-05')).toBe(0)
    expect(mondayFirstIndex('2026-01-11')).toBe(6)
  })
})

describe('daysFromPushes', () => {
  it('counts the pushes of each day', () => {
    const result = daysFromPushes([
      push('2026-01-05T10:00:00Z'),
      push('2026-01-05T18:00:00Z'),
      push('2026-01-06T09:00:00Z'),
    ])

    expect(result).toEqual([
      { date: '2026-01-05', count: 2, weekday: 1 },
      { date: '2026-01-06', count: 1, weekday: 2 },
    ])
  })

  it('returns nothing for no pushes', () => {
    expect(daysFromPushes([])).toEqual([])
  })
})

describe('computeStreaks', () => {
  it('finds the longest run of consecutive active days', () => {
    const today = new Date().toISOString().slice(0, 10)
    const days = [
      day(addDays(today, -6), 1),
      day(addDays(today, -5), 1),
      day(addDays(today, -4), 1),
      day(addDays(today, -3), 0),
      day(addDays(today, -2), 1),
      day(addDays(today, -1), 1),
    ]

    expect(computeStreaks(days).longest).toBe(3)
  })

  it('counts a streak that reaches today', () => {
    const today = new Date().toISOString().slice(0, 10)
    const days = [day(addDays(today, -2), 1), day(addDays(today, -1), 1), day(today, 1)]

    const streaks = computeStreaks(days)
    expect(streaks.current).toBe(3)
    expect(streaks.longest).toBe(3)
  })

  it('breaks the current streak when today has no activity', () => {
    const today = new Date().toISOString().slice(0, 10)
    const days = [day(addDays(today, -2), 1), day(addDays(today, -1), 1)]

    const streaks = computeStreaks(days)
    expect(streaks.current).toBe(0)
    expect(streaks.longest).toBe(2)
  })

  it('counts a streak that only ends yesterday as the longest, not the current one', () => {
    const today = new Date().toISOString().slice(0, 10)
    const days = [day(addDays(today, -3), 1), day(addDays(today, -2), 1), day(addDays(today, -1), 1)]

    const streaks = computeStreaks(days)
    expect(streaks.current).toBe(0)
    expect(streaks.longest).toBe(3)
  })

  it('handles an empty series', () => {
    expect(computeStreaks([])).toEqual({ current: 0, longest: 0, activeDays: 0 })
  })

  it('counts the active days', () => {
    const today = new Date().toISOString().slice(0, 10)
    const days = [day(today, 3), day(addDays(today, -1), 0), day(addDays(today, -2), 1)]

    expect(computeStreaks(days).activeDays).toBe(2)
  })
})

describe('fillQuietDays', () => {
  it('returns an empty list for no days', () => {
    expect(fillQuietDays([])).toEqual([])
  })

  it('inserts the days with no activity', () => {
    const filled = fillQuietDays([day('2026-01-05', 2), day('2026-01-08', 1)])

    expect(filled.map((entry) => entry.count)).toEqual([2, 0, 0, 1])
  })
})

describe('buildCalendar', () => {
  it('prefers the contribution calendar when there is one', () => {
    const calendar = buildCalendar(
      [{ date: '2026-01-05', count: 4, weekday: 1 }],
      [],
    )

    expect(calendar.measure).toBe('contributions')
    expect(calendar.total).toBe(4)
    expect(calendar.activeDays).toBe(1)
    expect(calendar.truncated).toBe(false)
  })

  it('falls back to the push feed when there is no calendar', () => {
    const calendar = buildCalendar(null, [push('2026-01-05T10:00:00Z')])

    expect(calendar.measure).toBe('pushes')
    expect(calendar.total).toBe(1)
  })

  it('fills the quiet days between the first and the last push', () => {
    const calendar = buildCalendar(null, [
      push('2026-01-05T10:00:00Z'),
      push('2026-01-08T10:00:00Z'),
    ])

    expect(calendar.days.map((day_) => day_.date)).toEqual([
      '2026-01-05',
      '2026-01-06',
      '2026-01-07',
      '2026-01-08',
    ])
    expect(calendar.days.map((day_) => day_.count)).toEqual([1, 0, 0, 1])
    expect(calendar.activeDays).toBe(2)
    expect(calendar.windowDays).toBe(4)
  })

  it('keeps the contribution calendar unfilled, because GitHub already sends every day', () => {
    const calendar = buildCalendar(
      [
        { date: '2026-01-05', count: 1, weekday: 1 },
        { date: '2026-01-06', count: 0, weekday: 2 },
      ],
      [],
    )

    expect(calendar.days).toHaveLength(2)
  })

  it('passes the truncation flag through', () => {
    expect(buildCalendar(null, [], { truncated: true }).truncated).toBe(true)
  })

  it('sorts the days by date', () => {
    const calendar = buildCalendar(
      [
        { date: '2026-01-06', count: 1, weekday: 2 },
        { date: '2026-01-05', count: 2, weekday: 1 },
      ],
      [],
    )

    expect(calendar.days.map((day_) => day_.date)).toEqual(['2026-01-05', '2026-01-06'])
  })
})
