import { useState } from 'react'
import { Icon } from '../Icon'
import { LogoMark } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'

interface LandingNavbarProps {
  onNavigate: (id: string) => void
  onEnterApp: () => void
}

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
]

export function LandingNavbar({ onNavigate, onEnterApp }: LandingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (id: string) => {
    setMenuOpen(false)
    onNavigate(id)
  }

  const handleEnterApp = () => {
    setMenuOpen(false)
    onEnterApp()
  }

  return (
    <header className="lnav">
      <div className="lnav__inner">
        <button
          type="button"
          className="lnav__brand"
          onClick={() => handleNav('home')}
          aria-label="APTIVUE AI home"
        >
          <LogoMark size={30} />
          <span className="lnav__brand-text">
            APTIVUE
            <span className="lnav__brand-suffix">AI</span>
          </span>
        </button>

        <nav
          className={`lnav__nav${menuOpen ? ' lnav__nav--open' : ''}`}
          aria-label="Primary"
        >
          <ul className="lnav__links">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  className="lnav__link"
                  onClick={() => handleNav(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="lnav__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleEnterApp}
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleEnterApp}
            >
              Get Started
            </button>
          </div>
        </nav>

        <div className="lnav__right">
          <ThemeToggle />
          <button
            type="button"
            className="icon-button lnav__menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
