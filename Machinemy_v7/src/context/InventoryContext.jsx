import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const InventoryContext = createContext(null)

const blankProfile = {
  name: '',
  email: '',
  phone: '',
  role: 'Gerente de Estoque',
  memberSince: '',
  status: 'Ativa',
}

const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  brand: row.brand || '',
  code: row.code || '',
  category: row.category || 'Outros',
  stock: Number(row.stock || 0),
  minStock: Number(row.minimum_stock || 0),
  expiry: row.expiry_date || '',
  status: row.status || 'Ativo',
  image: row.image_url || '',
  createdAt: row.created_at,
})

const mapEntry = (row) => ({
  id: row.id,
  productId: row.product_id,
  product: row.product_name,
  quantity: Number(row.quantity || 0),
  supplier: row.supplier || '',
  lot: row.lot || '',
  expiry: row.expiry_date ? new Date(`${row.expiry_date}T12:00:00`).toLocaleDateString('pt-BR') : '—',
  unitValue: Number(row.unit_value || 0),
  value: Number(row.unit_value || 0) * Number(row.quantity || 0),
  date: new Date(row.entry_date).toLocaleDateString('pt-BR'),
  notes: row.notes || '',
  createdAt: row.created_at,
})

const mapExit = (row) => ({
  id: row.id,
  productId: row.product_id,
  product: row.product_name,
  quantity: Number(row.quantity || 0),
  responsible: row.responsible || '',
  reason: row.reason || '',
  unitValue: Number(row.unit_value || 0),
  value: Number(row.unit_value || 0) * Number(row.quantity || 0),
  date: new Date(row.exit_date).toLocaleDateString('pt-BR'),
  notes: row.notes || '',
  createdAt: row.created_at,
})

export function InventoryProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [entries, setEntries] = useState([])
  const [exits, setExits] = useState([])
  const [profile, setProfileState] = useState(blankProfile)
  const [theme, setTheme] = useState(() => localStorage.getItem('machinemy_theme') || 'light')

  useEffect(() => {
    localStorage.setItem('machinemy_theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setProducts((data || []).map(mapProduct))
    return data
  }, [])

  const loadEntries = useCallback(async () => {
    const { data, error } = await supabase.from('entries').select('*').order('entry_date', { ascending: false })
    if (error) throw error
    setEntries((data || []).map(mapEntry))
    return data
  }, [])

  const loadExits = useCallback(async () => {
    const { data, error } = await supabase.from('exits').select('*').order('exit_date', { ascending: false })
    if (error) throw error
    setExits((data || []).map(mapExit))
    return data
  }, [])

  const loadProfile = useCallback(async (user) => {
    if (!user) {
      setProfileState(blankProfile)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      const fresh = {
        user_id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        role: 'Gerente de Estoque',
      }
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert(fresh)
        .select('*')
        .single()
      if (createError) throw createError
      setProfileState({
        name: created.name || '',
        email: created.email || user.email || '',
        phone: created.phone || '',
        role: created.role || 'Gerente de Estoque',
        memberSince: created.created_at?.slice(0, 10) || '',
        status: 'Ativa',
      })
      return
    }

    setProfileState({
      name: data.name || '',
      email: data.email || user.email || '',
      phone: data.phone || '',
      role: data.role || 'Gerente de Estoque',
      memberSince: data.created_at?.slice(0, 10) || '',
      status: 'Ativa',
    })
  }, [])

  const loadAll = useCallback(async (user) => {
    if (!user) {
      setProducts([])
      setEntries([])
      setExits([])
      setProfileState(blankProfile)
      return
    }
    setDataLoading(true)
    try {
      await Promise.all([loadProducts(), loadEntries(), loadExits(), loadProfile(user)])
    } finally {
      setDataLoading(false)
    }
  }, [loadProducts, loadEntries, loadExits, loadProfile])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const nextSession = data.session || null
      setSession(nextSession)
      setAuthLoading(false)
      if (nextSession?.user) loadAll(nextSession.user).catch(console.error)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthLoading(false)
      if (nextSession?.user) loadAll(nextSession.user).catch(console.error)
      else {
        setProducts([])
        setEntries([])
        setExits([])
        setProfileState(blankProfile)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [loadAll])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, name = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const addProduct = async (product) => {
    const user = session?.user
    if (!user) throw new Error('Faça login para cadastrar produtos.')
    const payload = {
      name: product.name,
      brand: product.brand || null,
      code: product.code || null,
      category: product.category,
      stock: Number(product.stock || 0),
      minimum_stock: Number(product.minStock || 0),
      expiry_date: product.expiry || null,
      status: product.status || 'Ativo',
      image_url: product.image || null,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from('products').insert(payload).select('*').single()
    if (error) throw error
    const mapped = mapProduct(data)
    setProducts((prev) => [mapped, ...prev])
    return mapped
  }

  const updateProduct = async (id, patch) => {
    const payload = {}
    if ('name' in patch) payload.name = patch.name
    if ('brand' in patch) payload.brand = patch.brand || null
    if ('code' in patch) payload.code = patch.code || null
    if ('category' in patch) payload.category = patch.category
    if ('stock' in patch) payload.stock = Number(patch.stock || 0)
    if ('minStock' in patch) payload.minimum_stock = Number(patch.minStock || 0)
    if ('expiry' in patch) payload.expiry_date = patch.expiry || null
    if ('status' in patch) payload.status = patch.status
    if ('image' in patch) payload.image_url = patch.image || null
    payload.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select('*').single()
    if (error) throw error
    const mapped = mapProduct(data)
    setProducts((prev) => prev.map((p) => p.id === id ? mapped : p))
    return mapped
  }

  const deleteProduct = async (id) => {
    const product = products.find((p) => p.id === id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    setProducts((prev) => prev.filter((p) => p.id !== id))

    if (product?.image?.includes('/storage/v1/object/public/product-images/')) {
      const path = decodeURIComponent(product.image.split('/storage/v1/object/public/product-images/')[1] || '')
      if (path) await supabase.storage.from('product-images').remove([path])
    }
  }

  const uploadProductImage = async (id, file) => {
    if (!session?.user) throw new Error('Faça login para alterar imagens.')
    if (!file?.type?.startsWith('image/')) throw new Error('Selecione uma imagem válida.')
    if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5 MB.')

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
    const path = `${session.user.id}/${id}-${Date.now()}.${safeExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return updateProduct(id, { image: data.publicUrl })
  }

  const addEntry = async (entry) => {
    const product = products.find((p) => p.id === Number(entry.productId))
    if (!product) throw new Error('Produto não encontrado.')
    const quantity = Number(entry.quantity || 0)
    if (quantity <= 0) throw new Error('Quantidade inválida.')

    const entryDate = entry.date ? new Date(`${entry.date}T12:00:00`).toISOString() : new Date().toISOString()
    const payload = {
      product_id: product.id,
      product_name: product.name,
      quantity,
      supplier: entry.supplier || null,
      lot: entry.lot || null,
      expiry_date: entry.expiry || null,
      unit_value: Number(entry.unitValue || 0),
      entry_date: entryDate,
      notes: entry.notes || null,
      created_by: session?.user?.id || null,
    }

    const { data: created, error: insertError } = await supabase.from('entries').insert(payload).select('*').single()
    if (insertError) throw insertError

    try {
      await updateProduct(product.id, { stock: product.stock + quantity })
    } catch (error) {
      await supabase.from('entries').delete().eq('id', created.id)
      throw error
    }

    const mapped = mapEntry(created)
    setEntries((prev) => [mapped, ...prev])
    return mapped
  }

  const addExit = async (exit) => {
    const product = products.find((p) => p.id === Number(exit.productId))
    if (!product) throw new Error('Produto não encontrado.')
    const quantity = Number(exit.quantity || 0)
    if (quantity <= 0) throw new Error('Quantidade inválida.')
    if (quantity > product.stock) throw new Error('Quantidade maior que o estoque disponível.')

    const exitDate = exit.date ? new Date(`${exit.date}T12:00:00`).toISOString() : new Date().toISOString()
    const payload = {
      product_id: product.id,
      product_name: product.name,
      quantity,
      responsible: exit.responsible || null,
      reason: exit.reason || null,
      unit_value: Number(exit.unitValue || 0),
      exit_date: exitDate,
      notes: exit.notes || null,
      created_by: session?.user?.id || null,
    }

    const { data: created, error: insertError } = await supabase.from('exits').insert(payload).select('*').single()
    if (insertError) throw insertError

    try {
      await updateProduct(product.id, { stock: product.stock - quantity })
    } catch (error) {
      await supabase.from('exits').delete().eq('id', created.id)
      throw error
    }

    const mapped = mapExit(created)
    setExits((prev) => [mapped, ...prev])
    return mapped
  }

  const updateProfile = async (nextProfile) => {
    const user = session?.user
    if (!user) throw new Error('Faça login para editar o perfil.')

    if (nextProfile.email && nextProfile.email !== user.email) {
      const { error: authError } = await supabase.auth.updateUser({ email: nextProfile.email })
      if (authError) throw authError
    }

    const payload = {
      user_id: user.id,
      name: nextProfile.name || null,
      email: nextProfile.email || user.email || null,
      phone: nextProfile.phone || null,
      role: nextProfile.role || 'Gerente de Estoque',
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: 'user_id' }).select('*').single()
    if (error) throw error

    const mapped = {
      name: data.name || '',
      email: data.email || user.email || '',
      phone: data.phone || '',
      role: data.role || 'Gerente de Estoque',
      memberSince: data.created_at?.slice(0, 10) || profile.memberSince,
      status: 'Ativa',
    }
    setProfileState(mapped)
    return mapped
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

  const bestSellers = useMemo(() => {
    const map = new Map()
    exits.forEach((exit) => {
      const key = String(exit.productId)
      const current = map.get(key) || { productId: exit.productId, name: exit.product, quantity: 0, value: 0 }
      current.quantity += Number(exit.quantity || 0)
      current.value += Number(exit.value || 0)
      map.set(key, current)
    })
    return [...map.values()].sort((a, b) => b.quantity - a.quantity)
  }, [exits])

  const value = {
    session,
    authLoading,
    dataLoading,
    isAuthenticated: Boolean(session?.user),
    products,
    entries,
    exits,
    alerts,
    bestSellers,
    addProduct,
    deleteProduct,
    updateProduct,
    uploadProductImage,
    addEntry,
    addExit,
    profile,
    updateProfile,
    theme,
    setTheme,
    signIn,
    signUp,
    signOut,
    refreshAll: () => loadAll(session?.user),
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export const useInventory = () => useContext(InventoryContext)
