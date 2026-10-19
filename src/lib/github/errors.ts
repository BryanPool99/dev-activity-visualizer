export type ErrorKind =
  | 'not-found'
  | 'unauthorized'
  | 'forbidden'
  | 'rate-limited'
  | 'network'
  | 'graphql'
  | 'unknown'

/**
 * Every failure the GitHub API can produce, normalised into one shape the UI can
 * switch on. `kind` is what the interface reacts to; `message` is for the reader.
 */
export class GitHubError extends Error {
  readonly kind: ErrorKind
  readonly status?: number
  /** Epoch millis when the quota refills, for the rate-limited case. */
  readonly resetAt?: number

  constructor(kind: ErrorKind, message: string, options: { status?: number; resetAt?: number } = {}) {
    super(message)
    this.name = 'GitHubError'
    this.kind = kind
    this.status = options.status
    this.resetAt = options.resetAt
  }

  static is(error: unknown): error is GitHubError {
    return error instanceof GitHubError
  }
}
