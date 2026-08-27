import Logo from './Logo'
import SearchBar from './SearchBar'
import IconButton from './IconButton'
import { SettingsIcon } from './icons/SidebarIcons'
import './Header.css'

export default function Header() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__logo">
        <Logo variant="header" showTagline={false} />
      </div>

      <div className="dashboard-header__search">
        <SearchBar />
      </div>

      <div className="dashboard-header__actions">
        <IconButton
          icon={<SettingsIcon />}
          label="Configurações"
          onClick={() => alert('Configurações em breve.')}
          className="dashboard-header__settings"
        />
      </div>
    </header>
  )
}
