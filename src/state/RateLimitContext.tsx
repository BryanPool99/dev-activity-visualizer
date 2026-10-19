import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type RateLimitState = {
  remaining: number
  limit: number
  resetAt: number
} | null

type RateLimitValue = {
  rateLimit: RateLimitState
  report: (next: RateLimitState) => void
}

const RateLimitContext = createContext<RateLimitValue | null>(null)

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [rateLimit, setRateLimit] = useState<RateLimitState>(null)

  const report = useCallback((next: RateLimitState) => setRateLimit(next), [])

  const value = useMemo(() => ({ rateLimit, report }), [rateLimit, report])

  return <RateLimitContext.Provider value={value}>{children}</RateLimitContext.Provider>
}

export function useRateLimit() {
  const ctx = useContext(RateLimitContext)
  if (!ctx) throw new Error('useRateLimit must be used inside <RateLimitProvider>')
  return ctx
}
