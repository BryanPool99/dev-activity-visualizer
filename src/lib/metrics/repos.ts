import type { Repo } from '../github/types'
import type { RepoMetrics } from './types'

/** The repositories that carry the work, and the numbers that describe them. */
export function buildRepoMetrics(repos: Repo[], truncated = 0): RepoMetrics {
  const top = [...repos]
    .sort((a, b) => b.stars - a.stars || b.forks - a.forks)
    .slice(0, 5)

  return {
    total: repos.length,
    stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
    forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
    top,
    truncated,
  }
}
