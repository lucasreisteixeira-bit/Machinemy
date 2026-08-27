import { SearchIcon } from './icons/SidebarIcons'
import './SearchBar.css'

export default function SearchBar() {
  return (
    <div className="search-bar">
      <SearchIcon />
      <input type="search" placeholder="Pesquisar..." aria-label="Pesquisar" />
    </div>
  )
}
