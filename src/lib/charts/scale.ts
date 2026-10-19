/**
 * The palette the data uses, kept apart from the interface chrome.
 *
 * The contribution grid borrows GitHub's own five-step scale, the way GitHub
 * uses it: the data carries the colour, the interface stays neutral.
 */
export const CONTRIBUTION_SCALE = [
  '#ebedf0', // nothing
  '#9be9a8',
  '#40c463',
  '#30a14e',
  '#216e39', // the busiest
] as const

export const CONTRIBUTION_SCALE_DARK = [
  '#161b22',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
] as const

/**
 * Which step a count sits on. The scale is relative to the account's own
 * maximum, the way GitHub reads a contribution graph.
 */
export function contributionLevel(count: number, max: number): number {
  if (count <= 0) return 0
  if (max <= 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/** A neutral ramp for the charts that carry no colour of their own. */
export const NEUTRAL_RAMP = ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#111827'] as const
