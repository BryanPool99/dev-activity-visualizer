import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { githubRest } from './client'
import { githubGraphQL } from './graphql'
import { GitHubError } from './errors'
import { subscribeRateLimit } from './rate-limit'
import type { RateLimitSnapshot } from './rate-limit'

function jsonResponse(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
  })
}

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('githubRest', () => {
  it('returns the decoded body on success', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ login: 'torvalds' }))

    await expect(githubRest<{ login: string }>('/users/torvalds')).resolves.toEqual({
      login: 'torvalds',
    })
  })

  it('sends the API version header and no authorization without a token', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))

    await githubRest('/users/torvalds')

    const [, init] = fetchMock.mock.calls[0]
    const headers = init.headers as Record<string, string>
    expect(headers['X-GitHub-Api-Version']).toBe('2022-11-28')
    expect(headers.Authorization).toBeUndefined()
  })

  it('sends the token as a bearer credential when there is one', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))

    await githubRest('/users/torvalds', { token: 'secret-token' })

    const [, init] = fetchMock.mock.calls[0]
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer secret-token')
  })

  it('maps a 404 to a not-found error', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Not Found' }, { status: 404 }))

    const error = await githubRest('/users/nope').catch((cause: unknown) => cause)

    expect(GitHubError.is(error)).toBe(true)
    expect((error as GitHubError).kind).toBe('not-found')
  })

  it('maps a 401 to an unauthorized error', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Bad credentials' }, { status: 401 }))

    const error = await githubRest('/user').catch((cause: unknown) => cause)

    expect((error as GitHubError).kind).toBe('unauthorized')
  })

  it('maps a 403 with an empty quota to a rate-limited error carrying the reset time', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { message: 'API rate limit exceeded' },
        {
          status: 403,
          headers: { 'x-ratelimit-limit': '60', 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1700000000' },
        },
      ),
    )

    const error = await githubRest('/users/torvalds').catch((cause: unknown) => cause)

    expect((error as GitHubError).kind).toBe('rate-limited')
    expect((error as GitHubError).resetAt).toBe(1700000000000)
  })

  it('publishes the remaining quota from the response headers', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {},
        {
          headers: { 'x-ratelimit-limit': '5000', 'x-ratelimit-remaining': '4998', 'x-ratelimit-reset': '1700000000' },
        },
      ),
    )

    const seen: RateLimitSnapshot[] = []
    const unsubscribe = subscribeRateLimit((snapshot) => seen.push(snapshot))

    await githubRest('/users/torvalds')
    unsubscribe()

    expect(seen).toEqual([{ limit: 5000, remaining: 4998, resetAt: 1700000000000 }])
  })

  it('turns a network failure into a network error', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const error = await githubRest('/users/torvalds').catch((cause: unknown) => cause)

    expect((error as GitHubError).kind).toBe('network')
  })
})

describe('githubGraphQL', () => {
  it('refuses to run without a token', async () => {
    const error = await githubGraphQL('query {}', {}).catch((cause: unknown) => cause)

    expect((error as GitHubError).kind).toBe('unauthorized')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns the data envelope', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { user: { login: 'torvalds' } } }))

    const data = await githubGraphQL<{ user: { login: string } }>('query {}', {}, { token: 'secret' })

    expect(data.user.login).toBe('torvalds')
  })

  it('publishes the GraphQL quota', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: { user: null },
        rateLimit: { limit: 5000, remaining: 4990, resetAt: '2024-01-01T00:00:00Z', cost: 1 },
      }),
    )

    const seen: RateLimitSnapshot[] = []
    const unsubscribe = subscribeRateLimit((snapshot) => seen.push(snapshot))

    await githubGraphQL('query {}', {}, { token: 'secret' })
    unsubscribe()

    expect(seen[0].remaining).toBe(4990)
    expect(seen[0].resetAt).toBe(Date.parse('2024-01-01T00:00:00Z'))
  })

  it('maps a GraphQL error message to a graphql error', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: null, errors: [{ message: 'Field "nope" doesn\'t exist' }] }),
    )

    const error = await githubGraphQL('query {}', {}, { token: 'secret' }).catch(
      (cause: unknown) => cause,
    )

    expect((error as GitHubError).kind).toBe('graphql')
  })

  it('recognises a rate limit message inside GraphQL errors', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: null, errors: [{ message: 'API rate limit exceeded for user' }] }),
    )

    const error = await githubGraphQL('query {}', {}, { token: 'secret' }).catch(
      (cause: unknown) => cause,
    )

    expect((error as GitHubError).kind).toBe('rate-limited')
  })
})
