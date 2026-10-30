import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Alerts from './pages/Alerts'
import Entry from './pages/Entry'
import Exit from './pages/Exit'
import Account from './pages/Account'
import BestSellers from './pages/BestSellers'
import { useInventory } from './context/InventoryContext'

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useInventory()
  if (authLoading) return <div style={{ padding: 40 }}>Carregando...</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/alertas" element={<Alerts />} />
        <Route path="/entrada" element={<Entry />} />
        <Route path="/saida" element={<Exit />} />
        <Route path="/conta" element={<Account />} />
        <Route path="/mais-vendidos" element={<BestSellers />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
}
