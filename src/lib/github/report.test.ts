import { describe, expect, it } from 'vitest'
import { aggregateLanguages } from './report'
import type { Repo } from './types'

function repo(name: string, languages: Repo['languages']): Repo {
  return {
    name,
    fullName: `owner/${name}`,
    description: null,
    url: `https://github.com/owner/${name}`,
    stars: 0,
    forks: 0,
    updatedAt: '2026-01-01T00:00:00Z',
    isFork: false,
    primaryLanguage: null,
    languages,
  }
}

describe('aggregateLanguages', () => {
  it('sums the bytes of the same language across repositories', () => {
    const result = aggregateLanguages([
      repo('a', [{ name: 'TypeScript', color: '#3178c6', bytes: 1000 }]),
      repo('b', [{ name: 'TypeScript', color: '#3178c6', bytes: 500 }]),
    ])

    expect(result).toEqual([{ name: 'TypeScript', color: '#3178c6', bytes: 1500 }])
  })

  it('sorts by size, biggest first', () => {
    const result = aggregateLanguages([
      repo('a', [{ name: 'Go', color: '#00ADD8', bytes: 100 }]),
      repo('b', [{ name: 'TypeScript', color: '#3178c6', bytes: 9000 }]),
    ])

    expect(result.map((language) => language.name)).toEqual(['TypeScript', 'Go'])
  })

  it('keeps the first colour it sees for a language', () => {
    const result = aggregateLanguages([
      repo('a', [{ name: 'Rust', color: '#dea584', bytes: 100 }]),
      repo('b', [{ name: 'Rust', color: null, bytes: 50 }]),
    ])

    expect(result[0].color).toBe('#dea584')
  })

  it('returns an empty list for a user with no code', () => {
    expect(aggregateLanguages([])).toEqual([])
  })
})
