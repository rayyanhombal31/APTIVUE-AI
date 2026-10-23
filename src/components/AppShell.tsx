import { useState } from 'react'
import { NAV_ITEMS } from '../nav'
import { Header } from './Header'
import { PlaceholderPage } from './PlaceholderPage'
import { Sidebar } from './Sidebar'
import { Overview } from '../pages/Overview'

export default function AppShell() {
  const [activeId, setActiveId] = useState(NAV_ITEMS[0].id)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const active = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0]

  const handleSelect = (id: string) => {
    setActiveId(id)
    setDrawerOpen(false)
  }

  return (
    <div className="shell">
      <Sidebar
        activeId={activeId}
        open={drawerOpen}
        onSelect={handleSelect}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="shell__main">
        <Header
          activeId={activeId}
          onMenuClick={() => setDrawerOpen(true)}
        />
        <main className="content">
          {activeId === 'overview' ? (
            <Overview onNavigate={handleSelect} />
          ) : (
            <PlaceholderPage item={active} />
          )}
        </main>
      </div>
    </div>
  )
}
