import AppShell from './components/AppShell'
import { ThemeProvider } from './ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
