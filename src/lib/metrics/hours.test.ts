import { describe, expect, it } from 'vitest'
import { buildHourHistogram, buildWeekdayHistogram, phaseOf } from './hours'
import type { PushRecord } from '../github/types'

function push(timestamp: string): PushRecord {
  return { repo: 'owner/repo', timestamp, ref: 'refs/heads/main', head: 'abc123' }
}

/** A timestamp at a given local hour, whatever the machine timezone is. */
function localPush(hour: number, dayOfMonth = 15): PushRecord {
  const now = new Date()
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    dayOfMonth,
    hour,
    0,
    0,
    0,
  )
  return push(date.toISOString())
}

describe('buildHourHistogram', () => {
  it('counts one bucket per hour of the day', () => {
    const result = buildHourHistogram([localPush(9), localPush(9), localPush(14)])

    expect(result.counts[9]).toBe(2)
    expect(result.counts[14]).toBe(1)
    expect(result.total).toBe(3)
  })

  it('finds the peak hour', () => {
    const result = buildHourHistogram([localPush(9), localPush(9), localPush(14)])

    expect(result.peakHour).toBe(9)
    expect(result.peakShare).toBeCloseTo(2 / 3)
  })

  it('has 24 buckets', () => {
    expect(buildHourHistogram([]).counts).toHaveLength(24)
  })

  it('has no peak when there is no activity', () => {
    const result = buildHourHistogram([])

    expect(result.peakHour).toBeNull()
    expect(result.peakShare).toBe(0)
    expect(result.phase).toBe('unknown')
  })
})

describe('phaseOf', () => {
  it('reads the small hours as night', () => {
    expect(phaseOf(2, 10)).toBe('night')
  })

  it('reads the morning as early', () => {
    expect(phaseOf(7, 10)).toBe('early')
  })

  it('reads the afternoon as daytime', () => {
    expect(phaseOf(15, 10)).toBe('daytime')
  })

  it('reads the night as evening', () => {
    expect(phaseOf(21, 10)).toBe('evening')
  })
})

describe('buildWeekdayHistogram', () => {
  it('counts the seven days, Monday first', () => {
    const result = buildWeekdayHistogram([localPush(10, 13), localPush(11, 13)])

    expect(result.counts).toHaveLength(7)
    expect(result.total).toBe(2)
  })

  it('reads the weekend share', () => {
    // 2026-01-17 is a Saturday, 2026-01-18 a Sunday.
    const result = buildWeekdayHistogram([
      push(new Date(2026, 0, 17, 10, 0, 0).toISOString()),
      push(new Date(2026, 0, 18, 10, 0, 0).toISOString()),
      push(new Date(2026, 0, 19, 10, 0, 0).toISOString()),
    ])

    expect(result.weekendShare).toBeCloseTo(2 / 3)
  })

  it('finds the busiest day', () => {
    const result = buildWeekdayHistogram([
      push(new Date(2026, 0, 19, 10, 0, 0).toISOString()),
      push(new Date(2026, 0, 19, 12, 0, 0).toISOString()),
    ])

    expect(result.busiest).toBe(0)
  })
})
