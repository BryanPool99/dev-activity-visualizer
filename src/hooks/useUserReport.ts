import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUserReport } from '../lib/github/report'
import { GitHubError } from '../lib/github/errors'
import { readCachedReport, writeCachedReport } from '../lib/cache'
import { useToken } from '../state/TokenContext'

const STALE_MS = 30 * 60 * 1000

/**
 * Loads the raw data for one account. The GraphQL path is used whenever a token
 * is present, so the report covers the whole year; without one it falls back to
 * the public REST feed and says so.
 */
export function useUserReport(username: string | null) {
  const { token } = useToken()
  const mode = token ? 'graphql' : 'rest'
  const key = username ? `${mode}:${username}` : null

  const cached = useMemo(
    () => (username ? readCachedReport(username, mode) : null),
    [username, mode],
  )

  const query = useQuery({
    queryKey: ['user-report', key],
    queryFn: () => fetchUserReport(username as string, { token }),
    enabled: Boolean(username),
    staleTime: STALE_MS,
    gcTime: 60 * 60 * 1000,
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.savedAt,
    retry: (failureCount, error) => {
      if (GitHubError.is(error)) {
        if (error.kind === 'not-found' || error.kind === 'unauthorized') return false
        if (error.kind === 'rate-limited') return false
      }
      return failureCount < 1
    },
  })

  useEffect(() => {
    if (query.data && username) writeCachedReport(username, mode, query.data)
  }, [query.data, username, mode])

  return query
}
