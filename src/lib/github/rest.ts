import { githubRest } from './client'
import type { RequestOptions } from './client'
import type { Language, Profile, PushRecord, Repo } from './types'

type RestUser = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  twitter_username: string | null
  followers: number
  following: number
  public_repos: number
  created_at: string
}

type RestRepo = {
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
  language: string | null
}

type RestPushEvent = {
  type: string
  created_at: string
  repo: { name: string }
  payload: {
    ref?: string
    head?: string
    push_id?: number
  }
}

export const REST_SOURCES = {
  profile: 'GET /users/{username}',
  repos: 'GET /users/{username}/repos?type=owner',
  events: 'GET /users/{username}/events/public',
} as const

export async function fetchProfile(username: string, options: RequestOptions = {}): Promise<Profile> {
  const user = await githubRest<RestUser>(`/users/${encodeURIComponent(username)}`, options)

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    company: user.company,
    location: user.location,
    websiteUrl: user.blog || null,
    twitterUsername: user.twitter_username,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    createdAt: user.created_at,
  }
}

export async function fetchRepos(username: string, options: RequestOptions = {}): Promise<Repo[]> {
  const repos = await githubRest<RestRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?type=owner&per_page=100&sort=pushed`,
    options,
  )

  return repos.map((repo) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    isFork: repo.fork,
    primaryLanguage: repo.language ? { name: repo.language, color: null } : null,
    languages: repo.language ? [{ name: repo.language, color: null, bytes: 0 }] : [],
  }))
}

/**
 * The public event feed. GitHub keeps roughly the last 90 days of it and caps a
 * single user at 300 events, so at most three pages are read.
 *
 * The payload of a `PushEvent` no longer carries the commit list, only the ref
 * and the head sha, so each push is one timestamped mark and the number of
 * commits inside it stays unknown.
 */
export async function fetchPushes(
  username: string,
  options: RequestOptions = {},
): Promise<{ pushes: PushRecord[]; truncated: boolean }> {
  const pushes: PushRecord[] = []
  let truncated = false

  for (let page = 1; page <= 3; page += 1) {
    const events = await githubRest<RestPushEvent[]>(
      `/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`,
      options,
    )

    for (const event of events) {
      if (event.type !== 'PushEvent') continue
      if (!event.created_at) continue
      pushes.push({
        repo: event.repo.name,
        timestamp: event.created_at,
        ref: event.payload?.ref ?? '',
        head: event.payload?.head ?? '',
      })
    }

    if (events.length < 100) {
      break
    }
    // The last page was full: there are more events than we were allowed to read.
    if (page === 3) truncated = true
  }

  return { pushes, truncated }
}

/** Byte counts per language for a single repository. */
export async function fetchRepoLanguages(
  owner: string,
  repo: string,
  options: RequestOptions = {},
): Promise<Record<string, number>> {
  return githubRest<Record<string, number>>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    options,
  )
}

export function sortLanguagesByBytes(languages: Language[]): Language[] {
  return [...languages].sort((a, b) => b.bytes - a.bytes)
}
