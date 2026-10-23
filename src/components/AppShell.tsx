import { useState } from 'react'
import { NAV_ITEMS } from '../nav'
import { Header } from './Header'
import { Icon } from './Icon'
import { Sidebar } from './Sidebar'

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
          <div className="page">
            <header className="page__header">
              <p className="page__eyebrow">APTIVUE AI</p>
              <h1 className="page__title">{active.label}</h1>
              <p className="page__desc">{active.description}</p>
            </header>

            <div className="page__placeholder">
              <span className="page__placeholder-icon">
                <Icon name={active.icon} size={28} />
              </span>
              <h2 className="page__placeholder-title">
                This section is in progress
              </h2>
              <p className="page__placeholder-text">
                The {active.label} experience will be built here in a later
                phase.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
