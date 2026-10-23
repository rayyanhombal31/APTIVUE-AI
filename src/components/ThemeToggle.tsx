import { useTheme } from '../theme'
import { Icon } from './Icon'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle__icon theme-toggle__icon--sun">
        <Icon name="sun" size={18} />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--moon">
        <Icon name="moon" size={18} />
      </span>
    </button>
  )
}
