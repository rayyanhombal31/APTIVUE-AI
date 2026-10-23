import { NAV_ITEMS } from '../nav'
import { Icon } from './Icon'
import { LogoMark } from './Logo'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  activeId: string
  onMenuClick: () => void
}

export function Header({ activeId, onMenuClick }: HeaderProps) {
  const active = NAV_ITEMS.find((item) => item.id === activeId)

  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="icon-button header__menu"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Icon name="menu" size={20} />
        </button>
        <span className="header__brand">
          <LogoMark size={26} />
          APTIVUE AI
        </span>
        <h2 className="header__title">{active?.label ?? 'Overview'}</h2>
      </div>

      <div className="header__right">
        <span className="header__badge">Beta</span>
        <ThemeToggle />
      </div>
    </header>
  )
}
