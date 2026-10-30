import Logo from './Logo'
import SearchBar from './SearchBar'
import { useInventory } from '../context/InventoryContext'
import './Header.css'

export default function Header() {
  const { theme, setTheme } = useInventory()
  const dark = theme === 'dark'
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__logo"><Logo variant="header" /></div>
      <div className="dashboard-header__search"><SearchBar /></div>
      <div className="dashboard-header__actions">
        <button className="theme-button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label="Alternar tema">
          <span className="theme-button__icon">{dark ? '☀' : '☾'}</span>
        </button>
      </div>
    </header>
  )
}
