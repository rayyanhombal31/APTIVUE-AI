import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import { ThemeProvider } from './ThemeProvider'
import { Landing } from './pages/Landing'
import { navigateToApp, parseRoute } from './router'
import type { Route } from './router'

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute())

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <ThemeProvider>
      {route === 'landing' ? (
        <Landing onEnterApp={navigateToApp} />
      ) : (
        <AppShell />
      )}
    </ThemeProvider>
  )
}
