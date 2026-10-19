import { buildApiHeaders } from './client'
import { GitHubError } from './errors'
import { publishRateLimit } from './rate-limit'
import type { RequestOptions } from './client'

export const GRAPHQL_ROOT = 'https://api.github.com/graphql'

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string; type?: string }[]
  rateLimit?: { limit: number; remaining: number; resetAt: string; cost: number }
}

/**
 * Calls GraphQL. GraphQL always needs a token — the public API allows anonymous
 * REST only — so the caller must fall back to REST when there is none.
 */
export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  options: RequestOptions = {},
): Promise<T> {
  if (!options.token) {
    throw new GitHubError('unauthorized', 'GraphQL needs a GitHub token.')
  }

  let response: Response
  try {
    response = await fetch(GRAPHQL_ROOT, {
      method: 'POST',
      headers: buildApiHeaders(options.token),
      body: JSON.stringify({ query, variables }),
      signal: options.signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new GitHubError('network', 'The network refused the request to GitHub.')
  }

  let body: GraphQLResponse<T>
  try {
    body = (await response.json()) as GraphQLResponse<T>
  } catch {
    throw new GitHubError('unknown', `GitHub answered ${response.status} with an unreadable body.`, {
      status: response.status,
    })
  }

  if (body.rateLimit) {
    publishRateLimit({
      limit: body.rateLimit.limit,
      remaining: body.rateLimit.remaining,
      resetAt: new Date(body.rateLimit.resetAt).getTime(),
    })
  }

  if (!response.ok || body.errors?.length) {
    const message = body.errors?.[0]?.message ?? ''
    if (/rate limit/i.test(message)) {
      throw new GitHubError('rate-limited', 'The GitHub request quota is spent.', {
        status: response.status,
      })
    }
    if (response.status === 401) {
      throw new GitHubError('unauthorized', 'GitHub rejected the token.', { status: 401 })
    }
    if (body.errors?.length) {
      throw new GitHubError('graphql', message || 'GitHub GraphQL refused the query.', {
        status: response.status,
      })
    }
    throw new GitHubError('unknown', `GitHub answered ${response.status}.`, { status: response.status })
  }

  if (!body.data) {
    throw new GitHubError('unknown', 'GitHub GraphQL returned no data.')
  }

  return body.data
}
