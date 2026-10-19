import { GitHubError } from './errors'
import { publishRateLimit } from './rate-limit'

export const API_ROOT = 'https://api.github.com'
export const API_VERSION = '2022-11-28'

export type RequestOptions = {
  token?: string | null
  signal?: AbortSignal
}

export function buildApiHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': API_VERSION,
  }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

/** GitHub reports the remaining quota on every REST response. */
function publishFromHeaders(response: Response) {
  const limit = Number(response.headers.get('x-ratelimit-limit'))
  const remaining = Number(response.headers.get('x-ratelimit-remaining'))
  const reset = Number(response.headers.get('x-ratelimit-reset'))

  if (Number.isFinite(limit) && Number.isFinite(remaining) && Number.isFinite(reset)) {
    publishRateLimit({ limit, remaining, resetAt: reset * 1000 })
  }
}

async function errorFromResponse(response: Response): Promise<GitHubError> {
  const remaining = Number(response.headers.get('x-ratelimit-remaining'))
  const reset = Number(response.headers.get('x-ratelimit-reset'))
  const resetAt = Number.isFinite(reset) ? reset * 1000 : undefined

  let detail = ''
  try {
    const body = (await response.json()) as { message?: string }
    if (body?.message) detail = body.message
  } catch {
    // Some error responses have no JSON body. The status still tells the story.
  }

  switch (response.status) {
    case 401:
      return new GitHubError('unauthorized', 'GitHub rejected the token.', { status: 401 })
    case 403:
      if (remaining === 0) {
        return new GitHubError('rate-limited', 'The GitHub request quota is spent.', {
          status: 403,
          resetAt,
        })
      }
      return new GitHubError('forbidden', detail || 'GitHub refused the request.', { status: 403 })
    case 404:
      return new GitHubError('not-found', 'That GitHub account does not exist.', { status: 404 })
    case 429:
      return new GitHubError('rate-limited', 'The GitHub request quota is spent.', {
        status: 429,
        resetAt,
      })
    default:
      return new GitHubError('unknown', detail || `GitHub answered ${response.status}.`, {
        status: response.status,
      })
  }
}

/** Calls a REST endpoint and returns the decoded body. */
export async function githubRest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      headers: buildApiHeaders(options.token),
      signal: options.signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new GitHubError('network', 'The network refused the request to GitHub.')
  }

  publishFromHeaders(response)

  if (!response.ok) throw await errorFromResponse(response)

  return (await response.json()) as T
}
