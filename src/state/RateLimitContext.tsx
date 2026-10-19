import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { subscribeRateLimit } from '../lib/github/rate-limit'
import type { RateLimitSnapshot } from '../lib/github/rate-limit'

export type RateLimitState = RateLimitSnapshot | null

type RateLimitValue = {
  rateLimit: RateLimitState
  report: (next: RateLimitState) => void
}

const RateLimitContext = createContext<RateLimitValue | null>(null)

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [rateLimit, setRateLimit] = useState<RateLimitState>(null)

  const report = useCallback((next: RateLimitState) => setRateLimit(next), [])

  useEffect(() => {
    return subscribeRateLimit((snapshot) => setRateLimit(snapshot))
  }, [])

  const value = useMemo(() => ({ rateLimit, report }), [rateLimit, report])

  return <RateLimitContext.Provider value={value}>{children}</RateLimitContext.Provider>
}

export function useRateLimit() {
  const ctx = useContext(RateLimitContext)
  if (!ctx) throw new Error('useRateLimit must be used inside <RateLimitProvider>')
  return ctx
}
