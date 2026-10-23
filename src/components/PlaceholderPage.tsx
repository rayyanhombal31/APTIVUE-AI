import type { NavItem } from '../nav'
import { Icon } from './Icon'

interface PlaceholderPageProps {
  item: NavItem
}

export function PlaceholderPage({ item }: PlaceholderPageProps) {
  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">APTIVUE AI</p>
        <h1 className="page__title">{item.label}</h1>
        <p className="page__desc">{item.description}</p>
      </header>

      <div className="page__placeholder">
        <span className="page__placeholder-icon">
          <Icon name={item.icon} size={28} />
        </span>
        <h2 className="page__placeholder-title">This section is in progress</h2>
        <p className="page__placeholder-text">
          The {item.label} experience will be built here in a later phase.
        </p>
      </div>
    </div>
  )
}
