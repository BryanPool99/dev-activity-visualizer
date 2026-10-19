import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { I18nProvider } from '../../i18n'
import { DuelGrid } from '../compare/DuelGrid'
import { Heatmap } from './Heatmap'
import { fitStrip } from '../../lib/charts/fit'
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

describe('fitStrip', () => {
  it('keeps the preferred cell when there is room', () => {
    const fit = fitStrip(53, 1300, 10)

    expect(fit.cell).toBe(10)
    expect(fit.gap).toBe(3)
    expect(fit.showWeekdays).toBe(true)
  })

  it('solves the cell so a year fits a phone', () => {
    const fit = fitStrip(53, 294, 10)

    const total = fit.labelWidth + 53 * fit.cell + 52 * fit.gap
    expect(total).toBeLessThanOrEqual(294)
    expect(fit.cell).toBeLessThan(10)
    expect(fit.gap).toBe(1)
  })

  it('keeps a short window big even on a narrow screen', () => {
    const fit = fitStrip(5, 294, 22)

    expect(fit.cell).toBe(22)
  })

  it('never shrinks a cell below two pixels', () => {
    const fit = fitStrip(53, 60, 10)

    expect(fit.cell).toBeGreaterThanOrEqual(2)
  })

  it('drops the weekday names when there is no room for them', () => {
    const fit = fitStrip(53, 240, 10)

    expect(fit.showWeekdays).toBe(false)
    expect(fit.labelWidth).toBe(0)
  })

  it('falls back to the preferred size when the width is not known yet', () => {
    const fit = fitStrip(53, null, 10)

    expect(fit.cell).toBe(10)
    expect(fit.gap).toBe(3)
  })
})

describe('wide grids', () => {
  it('draws the contribution grid with one cell per day', () => {
    const days = yearOfDays()
    const { container } = renderWithI18n(
      <Heatmap days={days} unitLabel="contributions" name="torvalds" />,
    )

    expect(container.querySelectorAll('rect')).toHaveLength(days.length)
  })

  it('names the period under the grid, for a reader who cannot see the months', () => {
    const { container } = renderWithI18n(
      <Heatmap days={yearOfDays()} unitLabel="contributions" name="torvalds" />,
    )

    expect(container.textContent).toMatch(/\d{4}/)
  })

  it('draws the duel grid with one cell per day', () => {
    const { container } = renderWithI18n(
      <DuelGrid days={yearOfDuelDays()} nameA="torvalds" nameB="gaearon" />,
    )

    expect(container.querySelectorAll('rect')).toHaveLength(366)
  })

  it('keeps the grid inside a strip that can scroll if it ever has to', () => {
    const { container } = renderWithI18n(
      <DuelGrid days={yearOfDuelDays()} nameA="torvalds" nameB="gaearon" />,
    )

    const svg = container.querySelector('svg[role="img"]')
    expect(svg?.parentElement?.classList.contains('overflow-x-auto')).toBe(true)
  })
})
