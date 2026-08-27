import { NavLink } from 'react-router-dom'
import { HomeIcon, BoxIcon, AlertIcon, EntryIcon, ExitIcon, UserIcon, ChartIcon } from './icons/SidebarIcons'
import './Sidebar.css'

const menuItems = [
  { to: '/dashboard', label: 'Início', icon: HomeIcon },
  { to: '/produtos', label: 'Produtos', icon: BoxIcon },
  { to: '/alertas', label: 'Alertas', icon: AlertIcon },
  { to: '/entrada', label: 'Entrada', subtitle: 'Entrada de produtos', icon: EntryIcon, iconColor: 'green' },
  { to: '/saida', label: 'Saída', subtitle: 'Saída de produtos', icon: ExitIcon, iconColor: 'orange' },
  { to: '/conta', label: 'Conta', icon: UserIcon },
  { to: '/mais-vendidos', label: 'Mais vendidos', icon: ChartIcon },
]

export default function Sidebar() {
  return <aside className="sidebar"><nav className="sidebar__nav">{menuItems.map(item=>{const Icon=item.icon;return <NavLink key={item.to} to={item.to} className={({isActive})=>`sidebar__item ${isActive?'sidebar__item--active':''}`} end={item.to==='/dashboard'}><span className={`sidebar__icon ${item.iconColor?`sidebar__icon--${item.iconColor}`:''}`}><Icon/></span><span className="sidebar__text"><span className="sidebar__label">{item.label}</span>{item.subtitle&&<span className="sidebar__subtitle">{item.subtitle}</span>}</span></NavLink>})}</nav></aside>
}
