import { fetchProfile, fetchPushes, fetchRepos, REST_SOURCES } from './rest'
import { githubGraphQL } from './graphql'
import { GRAPHQL_SOURCES, USER_REPORT_QUERY } from './queries'
import { GitHubError } from './errors'
import type { RequestOptions } from './client'
import type { CalendarDay, Language, Profile, PushRecord, RawUserData, Repo } from './types'

const REPO_LIMIT = 100

type GraphQLUserReport = {
  user: {
    login: string
    name: string | null
    avatarUrl: string
    bio: string | null
    company: string | null
    location: string | null
    websiteUrl: string | null
    twitterUsername: string | null
    createdAt: string
    followers: { totalCount: number }
    following: { totalCount: number }
    repositories: {
      totalCount: number
      nodes: {
        name: string
        nameWithOwner: string
        description: string | null
        url: string
        stargazerCount: number
        forkCount: number
        updatedAt: string
        isFork: boolean
        primaryLanguage: { name: string; color: string | null } | null
        languages: {
          edges: { size: number; node: { name: string; color: string | null } }[]
        }
      }[]
    }
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number
        weeks: {
          contributionDays: { date: string; contributionCount: number; weekday: number }[]
        }[]
      }
    }
  } | null
}

/** Sums the bytes per language across every repository. */
export function aggregateLanguages(repos: Repo[]): Language[] {
  const totals = new Map<string, Language>()

  for (const repo of repos) {
    for (const language of repo.languages) {
      const existing = totals.get(language.name)
      if (existing) {
        existing.bytes += language.bytes
        existing.color ??= language.color
      } else {
        totals.set(language.name, { ...language })
      }
    }
  }

  return [...totals.values()].sort((a, b) => b.bytes - a.bytes)
}

/** The real span the push feed covers, in days, from the oldest to the newest mark. */
export function pushWindowDays(pushes: PushRecord[]): number | undefined {
  if (pushes.length === 0) return undefined
  const times = pushes.map((push) => new Date(push.timestamp).getTime())
  const oldest = Math.min(...times)
  const newest = Math.max(...times)
  return Math.max(1, Math.round((newest - oldest) / 86_400_000) + 1)
}

/**
 * Fetches everything a report needs, in the richest way the current credentials
 * allow: GraphQL when there is a token, the public REST feed when there is not.
 */
export async function fetchUserReport(
  username: string,
  options: RequestOptions = {},
): Promise<RawUserData> {
  if (options.token) {
    const data = await githubGraphQL<GraphQLUserReport>(
      USER_REPORT_QUERY,
      { login: username, repoCount: REPO_LIMIT },
      options,
    )

    if (!data.user) {
      throw new GitHubError('not-found', 'That GitHub account does not exist.', { status: 404 })
    }

    const user = data.user
    const repos: Repo[] = user.repositories.nodes.map((node) => ({
      name: node.name,
      fullName: node.nameWithOwner,
      description: node.description,
      url: node.url,
      stars: node.stargazerCount,
      forks: node.forkCount,
      updatedAt: node.updatedAt,
      isFork: node.isFork,
      primaryLanguage: node.primaryLanguage,
      languages: node.languages.edges.map((edge) => ({
        name: edge.node.name,
        color: edge.node.color,
        bytes: edge.size,
      })),
    }))

    const calendar: CalendarDay[] = user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          weekday: day.weekday,
        })),
    )

    const profile: Profile = {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      company: user.company,
      location: user.location,
      websiteUrl: user.websiteUrl,
      twitterUsername: user.twitterUsername,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
      createdAt: user.createdAt,
    }

    const { pushes, truncated } = await fetchPushes(username, options)

    return {
      profile,
      repos,
      calendar,
      pushes,
      completeness: 'full',
      sources: {
        profile: GRAPHQL_SOURCES.profile,
        repos: GRAPHQL_SOURCES.repos,
        calendar: GRAPHQL_SOURCES.calendar,
        pushes: REST_SOURCES.events,
      },
      measures: { language: 'bytes', contributions: 'contributions' },
      truncatedRepos: Math.max(0, user.repositories.totalCount - repos.length),
      pushWindowDays: pushWindowDays(pushes),
      pushesTruncated: truncated,
    }
  }

  const [profile, repos, feed] = await Promise.all([
    fetchProfile(username, options),
    fetchRepos(username, options),
    fetchPushes(username, options),
  ])

  return {
    profile,
    repos,
    calendar: null,
    pushes: feed.pushes,
    completeness: 'partial',
    sources: {
      profile: REST_SOURCES.profile,
      repos: REST_SOURCES.repos,
      calendar: REST_SOURCES.events,
      pushes: REST_SOURCES.events,
    },
    measures: { language: 'repositories', contributions: 'pushes' },
    pushWindowDays: pushWindowDays(feed.pushes),
    pushesTruncated: feed.truncated,
  }
}
