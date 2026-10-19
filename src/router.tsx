import { Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/layout/AppHeader'
import { Home } from './pages/Home'
import { Report } from './pages/Report'
import { Compare } from './pages/Compare'
import { NotFound } from './pages/NotFound'

export function AppRoutes() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/u/:username" element={<Report />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
