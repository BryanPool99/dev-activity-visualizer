import { describe, expect, it } from 'vitest'
import { readCachedReport, writeCachedReport } from './cache'
import type { RawUserData } from './github/types'

const data: RawUserData = {
  profile: {
    login: 'torvalds',
    name: 'Linus',
    avatarUrl: 'https://example.test/a.png',
    bio: null,
    company: null,
    location: null,
    websiteUrl: null,
    twitterUsername: null,
    followers: 1,
    following: 1,
    publicRepos: 1,
    createdAt: '2011-09-03T00:00:00Z',
  },
  repos: [],
  calendar: null,
  pushes: [],
  completeness: 'partial',
  sources: { profile: 'x', repos: 'x', calendar: 'x', pushes: 'x' },
  measures: { language: 'repositories', contributions: 'pushes' },
}

describe('report cache', () => {
  it('returns null when nothing is stored', () => {
    expect(readCachedReport('torvalds', 'rest')).toBeNull()
  })

  it('round-trips a report', () => {
    writeCachedReport('torvalds', 'rest', data)

    const cached = readCachedReport('torvalds', 'rest')
    expect(cached?.data.profile.login).toBe('torvalds')
  })

  it('keeps the graphql and rest entries apart', () => {
    writeCachedReport('torvalds', 'rest', data)

    expect(readCachedReport('torvalds', 'graphql')).toBeNull()
  })

  it('drops a report older than half an hour', () => {
    writeCachedReport('torvalds', 'rest', data)
    const raw = window.localStorage.getItem('dav.report.rest:torvalds')
    expect(raw).toBeTruthy()

    const saved = JSON.parse(raw as string) as { savedAt: number }
    saved.savedAt = Date.now() - 31 * 60 * 1000
    window.localStorage.setItem('dav.report.rest:torvalds', JSON.stringify(saved))

    expect(readCachedReport('torvalds', 'rest')).toBeNull()
  })
})
