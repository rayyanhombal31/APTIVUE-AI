import { NAV_ITEMS } from '../nav'
import { Icon } from './Icon'
import { LogoMark } from './Logo'

interface SidebarProps {
  activeId: string
  open: boolean
  onSelect: (id: string) => void
  onClose: () => void
}

export function Sidebar({ activeId, open, onSelect, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`sidebar-overlay${open ? ' sidebar-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`sidebar${open ? ' sidebar--open' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="sidebar__brand">
          <LogoMark size={34} />
          <span className="sidebar__brand-text">
            <span className="sidebar__brand-name">APTIVUE</span>
            <span className="sidebar__brand-suffix">AI</span>
          </span>
          <button
            type="button"
            className="icon-button sidebar__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__label">Workspace</p>
          <ul className="sidebar__list">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeId
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-link${isActive ? ' nav-link--active' : ''}`}
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="nav-link__icon">
                      <Icon name={item.icon} size={18} />
                    </span>
                    <span className="nav-link__label">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <span className="sidebar__footer-dot" />
          <span>APTIVUE AI · v0.1</span>
        </div>
      </aside>
    </>
  )
}
