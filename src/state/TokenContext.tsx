import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'dav.githubToken'

type TokenValue = {
  token: string | null
  hasToken: boolean
  setToken: (token: string | null) => void
}

const TokenContext = createContext<TokenValue | null>(null)

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return window.sessionStorage.getItem(STORAGE_KEY)
  })

  const setToken = useCallback((next: string | null) => {
    setTokenState(next)
    if (next) window.sessionStorage.setItem(STORAGE_KEY, next)
    else window.sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(() => ({ token, hasToken: Boolean(token), setToken }), [token, setToken])

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}

export function useToken() {
  const ctx = useContext(TokenContext)
  if (!ctx) throw new Error('useToken must be used inside <TokenProvider>')
  return ctx
}

/** GitHub's own endpoint, used to validate a token before it is stored. */
export async function verifyToken(token: string): Promise<{ login: string }> {
  const response = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) throw new Error(`GitHub rejected the token (${response.status})`)
  const data = (await response.json()) as { login: string }
  return data
}

export { STORAGE_KEY as TOKEN_STORAGE_KEY }
