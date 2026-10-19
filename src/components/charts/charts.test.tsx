import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Heatmap } from './Heatmap'
import { LanguageRing } from './LanguageRing'
import { HourDial } from './HourDial'
import { WeekdayStrip } from './WeekdayStrip'
import type { DayCount, LanguageSlice } from '../../lib/metrics/types'

const days: DayCount[] = [
  { date: '2026-01-04', count: 0, weekday: 0 },
  { date: '2026-01-05', count: 3, weekday: 1 },
  { date: '2026-01-06', count: 1, weekday: 2 },
  { date: '2026-01-07', count: 0, weekday: 3 },
  { date: '2026-01-08', count: 5, weekday: 4 },
  { date: '2026-01-09', count: 2, weekday: 5 },
  { date: '2026-01-10', count: 0, weekday: 6 },
  { date: '2026-01-11', count: 4, weekday: 0 },
]

describe('Heatmap', () => {
  it('draws one cell per day', () => {
    const { container } = render(<Heatmap days={days} unitLabel="contributions" name="torvalds" />)

    expect(container.querySelectorAll('rect')).toHaveLength(days.length)
  })

  it('labels the grid for a screen reader', () => {
    render(<Heatmap days={days} unitLabel="contributions" name="torvalds" />)

    expect(
      screen.getByRole('img', { name: /torvalds: 15 contributions across 5 active days/ }),
    ).toBeInTheDocument()
  })

  it('renders nothing when there are no days', () => {
    const { container } = render(<Heatmap days={[]} unitLabel="contributions" name="torvalds" />)

    expect(container.querySelector('svg')).toBeNull()
  })

  it('colours the busiest day on the darkest step', () => {
    const { container } = render(<Heatmap days={days} unitLabel="contributions" name="torvalds" />)
    const rects = container.querySelectorAll('rect')

    // 5 is the maximum, so it takes the last step of the scale.
    expect(rects[4]).toHaveAttribute('fill', 'var(--contribution-4)')
    expect(rects[0]).toHaveAttribute('fill', 'var(--contribution-0)')
  })
})

describe('LanguageRing', () => {
  const items: LanguageSlice[] = [
    { name: 'TypeScript', color: '#9ca3af', value: 750, share: 0.75 },
    { name: 'Rust', color: '#2563eb', value: 250, share: 0.25 },
  ]

  it('draws one arc per language', () => {
    const { container } = render(
      <LanguageRing items={items} measureLabel="bytes" measure="bytes" />,
    )

    expect(container.querySelectorAll('circle')).toHaveLength(items.length + 1)
  })

  it('names the leading language in the middle', () => {
    render(<LanguageRing items={items} measureLabel="bytes" measure="bytes" />)

    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('reads the values as bytes', () => {
    render(<LanguageRing items={items} measureLabel="bytes" measure="bytes" />)

    expect(screen.getByText('750 B')).toBeInTheDocument()
  })
})

describe('HourDial', () => {
  it('draws one spoke per hour with activity', () => {
    const counts = new Array<number>(24).fill(0)
    counts[9] = 3
    counts[14] = 1

    const { container } = render(<HourDial counts={counts} peakHour={9} name="torvalds" />)

    expect(container.querySelectorAll('line')).toHaveLength(2)
  })

  it('marks the peak hour in ink and the rest in grey', () => {
    const counts = new Array<number>(24).fill(0)
    counts[9] = 3
    counts[14] = 1

    const { container } = render(<HourDial counts={counts} peakHour={9} name="torvalds" />)
    const spokes = container.querySelectorAll('line')

    expect(spokes[0]).toHaveAttribute('stroke', 'var(--ink)')
    expect(spokes[1]).toHaveAttribute('stroke', 'var(--line-strong)')
  })

  it('draws no spoke when there is no activity', () => {
    const { container } = render(
      <HourDial counts={new Array<number>(24).fill(0)} peakHour={null} name="torvalds" />,
    )

    expect(container.querySelectorAll('line')).toHaveLength(0)
  })
})

describe('WeekdayStrip', () => {
  it('draws one column per day', () => {
    const counts = [1, 0, 3, 0, 2, 0, 1]

    const { container } = render(
      <WeekdayStrip
        counts={counts}
        busiest={2}
        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        name="torvalds"
      />,
    )

    expect(container.querySelectorAll('rect')).toHaveLength(7)
  })
})
