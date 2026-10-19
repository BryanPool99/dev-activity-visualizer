import type { Repo } from '../github/types'
import type { LanguageMetrics, LanguageSlice } from './types'

/**
 * The language breakdown.
 *
 * With a token the reading is bytes of code, straight from GraphQL. Without one
 * the API only exposes the primary language of each repository, so the reading
 * becomes "how many repositories", and the chart says which it is showing.
 */
export function buildLanguageMetrics(
  repos: Repo[],
  measure: 'bytes' | 'repositories',
): LanguageMetrics {
  const values = new Map<string, { color: string | null; value: number }>()

  for (const repo of repos) {
    for (const language of repo.languages) {
      const existing = values.get(language.name)
      if (existing) {
        existing.value += measure === 'bytes' ? language.bytes : 1
        existing.color ??= language.color
      } else {
        values.set(language.name, {
          color: language.color,
          value: measure === 'bytes' ? language.bytes : 1,
        })
      }
    }
  }

  const total = [...values.values()].reduce((sum, entry) => sum + entry.value, 0)

  const items: LanguageSlice[] = [...values.entries()]
    .map(([name, entry]) => ({
      name,
      color: entry.color,
      value: entry.value,
      share: total > 0 ? entry.value / total : 0,
    }))
    .sort((a, b) => b.value - a.value)

  return { items, total, measure }
}
