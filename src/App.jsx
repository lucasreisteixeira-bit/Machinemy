import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import PlaceholderPage from './pages/PlaceholderPage'
import Products from './pages/Products'
import Account from './pages/Account'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/alertas" element={<PlaceholderPage title="Alertas" />} />
        <Route path="/entrada" element={<PlaceholderPage title="Entrada" />} />
        <Route path="/saida" element={<PlaceholderPage title="Saída" />} />
        <Route path="/conta" element={<Account />} />
        <Route path="/cadastro" element={<Navigate to="/produtos" replace />} />
        <Route path="/mais-vendidos" element={<PlaceholderPage title="Mais vendidos" />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
