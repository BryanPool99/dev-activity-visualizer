export type RateLimitSnapshot = {
  remaining: number
  limit: number
  /** Epoch millis when the quota refills. */
  resetAt: number
}

type Listener = (snapshot: RateLimitSnapshot) => void

const listeners = new Set<Listener>()

/** The client is framework-free, so it publishes quota state through this channel. */
export function publishRateLimit(snapshot: RateLimitSnapshot) {
  for (const listener of listeners) listener(snapshot)
}

export function subscribeRateLimit(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
