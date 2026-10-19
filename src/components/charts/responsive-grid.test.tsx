import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { I18nProvider } from '../../i18n'
import { DuelGrid } from '../compare/DuelGrid'
import { Heatmap } from './Heatmap'
import type { DuelDay } from '../../lib/metrics/duel'
import type { DayCount } from '../../lib/metrics/types'

function renderWithI18n(ui: ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

/** A full year of days, as a token-bearing account would return it. */
function yearOfDays(): DayCount[] {
  const days: DayCount[] = []
  const start = new Date(Date.UTC(2025, 8, 20))
  for (let index = 0; index < 366; index += 1) {
    const date = new Date(start)
    date.setUTCDate(date.getUTCDate() + index)
    const key = date.toISOString().slice(0, 10)
    days.push({ date: key, count: index % 7, weekday: date.getUTCDay() })
  }
  return days
}

/** The same year, split between two accounts. */
function yearOfDuelDays(): DuelDay[] {
  return yearOfDays().map((day) => ({
    date: day.date,
    a: day.count,
    b: (day.count + 3) % 5,
    winner: day.count > ((day.count + 3) % 5) ? 'a' : day.count < ((day.count + 3) % 5) ? 'b' : 'tie',
  }))
}

describe('wide grids on a narrow screen', () => {
  it('keeps the heatmap at its natural width inside a scrollable strip', () => {
    const days = yearOfDays()
    const { container } = renderWithI18n(
      <Heatmap days={days} unitLabel="contributions" name="torvalds" />,
    )

    const svg = container.querySelector('svg[role="img"]')
    const strip = svg?.parentElement

    // The grid is not scaled down to fit: it keeps its size and scrolls.
    expect(Number(svg?.getAttribute('width'))).toBeGreaterThan(600)
    expect(svg?.classList.contains('shrink-0')).toBe(true)
    expect(strip?.classList.contains('overflow-x-auto')).toBe(true)
  })

  it('keeps the duel grid at its natural width inside a scrollable strip', () => {
    const { container } = renderWithI18n(
      <DuelGrid days={yearOfDuelDays()} nameA="torvalds" nameB="gaearon" />,
    )

    const svg = container.querySelector('svg[role="img"]')
    const strip = svg?.parentElement

    expect(Number(svg?.getAttribute('width'))).toBeGreaterThan(600)
    expect(svg?.classList.contains('shrink-0')).toBe(true)
    expect(strip?.classList.contains('overflow-x-auto')).toBe(true)
  })

  it('tells a narrow reader that the strip moves', () => {
    const { container } = renderWithI18n(
      <DuelGrid days={yearOfDuelDays()} nameA="torvalds" nameB="gaearon" />,
    )

    expect(container.textContent).toContain('Desliza')
  })
})
