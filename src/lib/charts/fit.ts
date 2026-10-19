/**
 * How a wide grid fits a narrow screen.
 *
 * The contribution grid and the duel grid are one column per week, so a full
 * year is 53 columns. On a desktop that is 10px cells; on a phone the same
 * reading has to fit 294px, which means the cell has to be recomputed from the
 * space actually available. A grid scaled down with CSS would shrink the cells
 * and the gap together, leaving 4px squares that read as noise — so the size is
 * solved instead of scaled.
 */
export type StripFit = {
  /** The edge of a cell, in pixels. */
  cell: number
  /** The gap between cells, in pixels. */
  gap: number
  /** The room taken by the weekday labels; zero when they are dropped. */
  labelWidth: number
  /** Whether the weekday names are drawn. */
  showWeekdays: boolean
  /** Whether the month names are drawn. */
  showMonths: boolean
  /** The corner radius of a cell. */
  radius: number
}

const MIN_CELL = 2
const TIGHT_BELOW = 420
const WEEKDAYS_ABOVE = 300

export function fitStrip(
  columns: number,
  available: number | null,
  preferredCell: number,
): StripFit {
  if (!available || columns <= 0) {
    return {
      cell: preferredCell,
      gap: 3,
      labelWidth: 28,
      showWeekdays: true,
      showMonths: true,
      radius: 2,
    }
  }

  const tight = available < TIGHT_BELOW
  const gap = tight ? 1 : 3
  const showWeekdays = available >= WEEKDAYS_ABOVE
  const labelWidth = showWeekdays ? 28 : 0
  const usable = available - labelWidth

  const cell = Math.max(
    MIN_CELL,
    Math.min(preferredCell, (usable - gap * (columns - 1)) / columns),
  )

  return {
    cell,
    gap,
    labelWidth,
    showWeekdays,
    // Month names need roughly 30px each; below that they would collide.
    showMonths: available >= 260,
    radius: cell >= 8 ? 2 : 1,
  }
}
