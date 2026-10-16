import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const InventoryContext = createContext(null)

const seedProducts = [
  { id: 1, name: 'Arroz Tipo 1 (5kg)', brand: 'Camil', code: '7891234567890', category: 'Alimentos', stock: 16, minStock: 50, expiry: '2024-12-31', status: 'Ativo', image: '' },
  { id: 2, name: 'Óleo de Soja (900ml)', brand: 'Soya', code: '789100000002', category: 'Alimentos', stock: 30, minStock: 20, expiry: '2026-06-05', status: 'Ativo', image: '' },
  { id: 3, name: 'Leite Integral (1L)', brand: 'Italac', code: '789100000003', category: 'Bebidas', stock: 45, minStock: 20, expiry: '2026-06-08', status: 'Ativo', image: '' },
  { id: 4, name: 'Feijão Carioca (1kg)', brand: 'Kicaldo', code: '789100000004', category: 'Alimentos', stock: 12, minStock: 30, expiry: '2026-11-10', status: 'Ativo', image: '' },
  { id: 5, name: 'Farinha de Trigo (1kg)', brand: 'Dona Benta', code: '789100000005', category: 'Alimentos', stock: 0, minStock: 10, expiry: '2024-05-20', status: 'Ativo', image: '' },
  { id: 6, name: 'Açúcar Refinado (1kg)', brand: 'União', code: '789100000006', category: 'Alimentos', stock: 60, minStock: 20, expiry: '2027-01-10', status: 'Ativo', image: '' },
]

const seedEntries = [
  { id: 101, productId: 1, product: 'Arroz Tipo 1 (5kg)', quantity: 100, supplier: 'Distribuidora Bom Preço', lot: 'ARZ290524', expiry: '29/11/2024', value: 550, date: '29/05/2024 08:45' },
  { id: 102, productId: 4, product: 'Feijão Carioca (1kg)', quantity: 80, supplier: 'Distribuidora Bom Preço', lot: 'FEJ290524', expiry: '10/01/2025', value: 240, date: '29/05/2024 08:30' },
  { id: 103, productId: 2, product: 'Óleo de Soja (900ml)', quantity: 60, supplier: 'Alimentos Sul', lot: 'OLE280524', expiry: '28/02/2025', value: 360, date: '28/05/2024 17:20' },
  { id: 104, productId: 3, product: 'Leite Integral (1L)', quantity: 120, supplier: 'Laticínios União', lot: 'LEI280524', expiry: '15/06/2024', value: 372, date: '28/05/2024 14:10' },
  { id: 105, productId: 5, product: 'Farinha de Trigo (1kg)', quantity: 70, supplier: 'Moinho Real', lot: 'FAR270524', expiry: '27/10/2024', value: 175, date: '27/05/2024 09:15' },
]

const seedExits = [
  { id: 201, productId: 1, product: 'Arroz Tipo 1 (5kg)', quantity: 50, reason: 'Venda no balcão', responsible: 'João Silva', value: 275, date: '29/05/2024 15:30' },
  { id: 202, productId: 2, product: 'Óleo de Soja (900ml)', quantity: 30, reason: 'Pedido #1254', responsible: 'Maria Oliveira', value: 180, date: '29/05/2024 14:10' },
  { id: 203, productId: 3, product: 'Leite Integral (1L)', quantity: 20, reason: 'Venda no balcão', responsible: 'João Silva', value: 60, date: '29/05/2024 12:45' },
  { id: 204, productId: 4, product: 'Feijão Carioca (1kg)', quantity: 25, reason: 'Transferência para loja 2', responsible: 'Maria Oliveira', value: 87.5, date: '28/05/2024 17:20' },
  { id: 205, productId: 5, product: 'Farinha de Trigo (1kg)', quantity: 40, reason: 'Venda no balcão', responsible: 'Carlos Santos', value: 92, date: '28/05/2024 16:05' },
]

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(() => read('machinemy_products', seedProducts))
  const [entries, setEntries] = useState(() => read('machinemy_entries', seedEntries))
  const [exits, setExits] = useState(() => read('machinemy_exits', seedExits))
  const [theme, setTheme] = useState(() => localStorage.getItem('machinemy_theme') || 'light')

  useEffect(() => localStorage.setItem('machinemy_products', JSON.stringify(products)), [products])
  useEffect(() => localStorage.setItem('machinemy_entries', JSON.stringify(entries)), [entries])
  useEffect(() => localStorage.setItem('machinemy_exits', JSON.stringify(exits)), [exits])
  useEffect(() => {
    localStorage.setItem('machinemy_theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  const addProduct = (product) => setProducts((prev) => [...prev, { ...product, id: Date.now() }])
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id))
  const updateProduct = (id, patch) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p))

  const addEntry = (entry) => {
    const id = Date.now()
    setEntries((prev) => [{ ...entry, id }, ...prev])
    setProducts((prev) => prev.map((p) => p.id === Number(entry.productId) ? { ...p, stock: Number(p.stock) + Number(entry.quantity) } : p))
  }

  const addExit = (exit) => {
    const id = Date.now()
    setExits((prev) => [{ ...exit, id }, ...prev])
    setProducts((prev) => prev.map((p) => p.id === Number(exit.productId) ? { ...p, stock: Math.max(0, Number(p.stock) - Number(exit.quantity)) } : p))
  }

  const alerts = useMemo(() => {
    const now = new Date()
    return products.map((p) => {
      const low = Number(p.stock) < Number(p.minStock)
      const exp = p.expiry ? new Date(`${p.expiry}T00:00:00`) : null
      const diff = exp ? Math.ceil((exp - now) / 86400000) : null
      if (exp && diff < 0) return { ...p, alertType: 'Vencido', alertTone: 'red', detail: 'Produto vencido', dateLabel: exp.toLocaleDateString('pt-BR') }
      if (low) return { ...p, alertType: 'Estoque baixo', alertTone: 'red', detail: `Estoque abaixo do mínimo · Mínimo: ${p.minStock} un`, dateLabel: '—' }
      if (exp && diff <= 15) return { ...p, alertType: 'Validade próxima', alertTone: 'orange', detail: `Vence em ${diff} dias`, dateLabel: exp.toLocaleDateString('pt-BR') }
      return null
    }).filter(Boolean)
  }, [products])

  const value = { products, entries, exits, alerts, addProduct, deleteProduct, updateProduct, addEntry, addExit, theme, setTheme }
  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export const useInventory = () => useContext(InventoryContext)
