import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import '../styles/dashboard.css'

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard__separator" />
      <div className="dashboard__body">
        <Sidebar />
        <main className="dashboard__main">
          <div className="dashboard__main-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
