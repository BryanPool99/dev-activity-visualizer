/**
 * The contribution scale.
 *
 * The five steps live in CSS (`--contribution-0` … `--contribution-4`) so a
 * theme can hold its own version of them: GitHub's light scale on a light
 * ground, GitHub's own dark scale on a dark one.
 */

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

/** The fill for a step, resolved by the theme in force. */
export function contributionFill(level: number): string {
  return `var(--contribution-${Math.max(0, Math.min(4, level))})`
}
