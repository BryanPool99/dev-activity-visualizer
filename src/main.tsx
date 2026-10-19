import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { I18nProvider } from './i18n'
import { TokenProvider } from './state/TokenContext'
import { RateLimitProvider } from './state/RateLimitContext'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nProvider>
          <TokenProvider>
            <RateLimitProvider>
              <App />
            </RateLimitProvider>
          </TokenProvider>
        </I18nProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
