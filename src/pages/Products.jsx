import { useMemo, useRef, useState } from 'react'
import { BoxIcon, SearchIcon } from '../components/icons/SidebarIcons'
import '../styles/products.css'

function SvgIcon({ type, size = 20 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true }
  const common = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'filter') return <svg {...props}><path {...common} d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" /></svg>
  if (type === 'plus') return <svg {...props}><path {...common} d="M12 5v14M5 12h14" /></svg>
  if (type === 'chevron') return <svg {...props}><path {...common} d="m8 10 4 4 4-4" /></svg>
  if (type === 'more') return <svg {...props}><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
  if (type === 'left') return <svg {...props}><path {...common} d="m14 7-5 5 5 5" /></svg>
  if (type === 'right') return <svg {...props}><path {...common} d="m10 7 5 5-5 5" /></svg>
  if (type === 'close') return <svg {...props}><path {...common} d="m6 6 12 12M18 6 6 18" /></svg>
  if (type === 'image') return <svg {...props}><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><circle {...common} cx="8.5" cy="10" r="1.5" /><path {...common} d="m21 15-5-5L5 19" /></svg>
  if (type === 'trash') return <svg {...props}><path {...common} d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5M14 11v5" /></svg>
  return null
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas as categorias')
  const [status, setStatus] = useState('Todos os status')
  const [modalOpen, setModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [imageTargetId, setImageTargetId] = useState(null)
  const imageInputRef = useRef(null)
  const [form, setForm] = useState({ name: '', brand: '', code: '', category: 'Cereais', stock: '', minStock: '', expiry: '', status: 'Ativo' })

  const filtered = useMemo(() => products.filter((product) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || [product.name, product.code, product.category, product.brand].some(v => String(v).toLowerCase().includes(q))
    const matchesCategory = category === 'Todas as categorias' || product.category === category
    const matchesStatus = status === 'Todos os status' || product.status === status
    return matchesQuery && matchesCategory && matchesStatus
  }), [products, query, category, status])

  const categories = [...new Set(products.map(p => p.category))]

  const handleDelete = (product) => {
    const confirmed = window.confirm(`Excluir o produto \"${product.name}\"? Esta ação não pode ser desfeita.`)
    if (!confirmed) return
    setProducts(prev => prev.filter(item => item.id !== product.id))
    setOpenMenuId(null)
  }

  const requestImageChange = (productId) => {
    setImageTargetId(productId)
    setOpenMenuId(null)
    imageInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !imageTargetId) return
    if (!file.type.startsWith('image/')) {
      window.alert('Selecione um arquivo de imagem válido.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProducts(prev => prev.map(item => item.id === imageTargetId ? { ...item, image: reader.result } : item))
      setImageTargetId(null)
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.code.trim()) return
    setProducts(prev => [...prev, { ...form, id: Date.now(), stock: Number(form.stock || 0), minStock: Number(form.minStock || 0) }])
    setModalOpen(false)
    setForm({ name: '', brand: '', code: '', category: 'Cereais', stock: '', minStock: '', expiry: '', status: 'Ativo' })
  }

  return (
    <section className="products-page">
      <div className="page-heading products-page__heading">
        <div className="page-heading__left">
          <div className="page-heading__icon page-heading__icon--box"><BoxIcon /></div>
          <div>
            <h1>Produtos</h1>
            <p>Veja e gerencie todos os produtos cadastrados no estoque.</p>
          </div>
        </div>
        <div className="products-page__top-actions">
          <button className="btn btn--outline" type="button"><SvgIcon type="filter" />Filtros</button>
          <button className="btn btn--primary" type="button" onClick={() => setModalOpen(true)}><SvgIcon type="plus" />Novo produto</button>
        </div>
      </div>

      <div className="products-page__filters">
        <label className="products-search"><SearchIcon /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar produto por nome, código ou categoria..." /></label>
        <label className="select-control"><select value={category} onChange={e => setCategory(e.target.value)}><option>Todas as categorias</option>{categories.map(c => <option key={c}>{c}</option>)}</select><SvgIcon type="chevron" /></label>
        <label className="select-control"><select value={status} onChange={e => setStatus(e.target.value)}><option>Todos os status</option><option>Ativo</option><option>Inativo</option></select><SvgIcon type="chevron" /></label>
      </div>

      <div className="products-table-card">
        <div className="products-table__head">
          <span>Produto</span><span>Código</span><span>Categoria</span><span>Estoque atual</span><span>Estoque mínimo</span><span>Validade</span><span>Status</span><span>Ações</span>
        </div>

        {products.length === 0 ? (
          <div className="products-empty">
            <div className="products-empty__icon"><BoxIcon /></div>
            <strong>Nenhum produto cadastrado ainda.</strong>
            <p>Clique em “Novo produto” para cadastrar o primeiro item.</p>
            <button className="btn btn--primary products-empty__button" type="button" onClick={() => setModalOpen(true)}><SvgIcon type="plus" />Novo produto</button>
          </div>
        ) : filtered.length > 0 ? (
          <>
            {filtered.map(product => (
              <div className="product-row" key={product.id}>
                <div className="product-cell product-cell--name">
                  <div className={`product-thumb ${product.image ? 'product-thumb--image' : ''}`}>
                    {product.image ? <img src={product.image} alt={`Imagem de ${product.name}`} /> : <BoxIcon />}
                  </div>
                  <div><strong>{product.name}</strong><span>Marca: {product.brand || '—'}</span></div>
                </div>
                <div className="product-cell">{product.code}</div>
                <div className="product-cell">{product.category}</div>
                <div className="product-cell product-cell--stock">{product.stock} un</div>
                <div className="product-cell">{product.minStock} un</div>
                <div className="product-cell">{product.expiry || '—'}</div>
                <div className="product-cell"><span className={`status-badge ${product.status === 'Ativo' ? 'status-badge--active' : ''}`}>{product.status}</span></div>
                <div className="product-cell product-cell--actions">
                  <div className="product-actions">
                    <button className="product-actions__trigger" aria-label={`Ações de ${product.name}`} aria-expanded={openMenuId === product.id} onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}><SvgIcon type="more" /></button>
                    {openMenuId === product.id && (
                      <div className="product-actions__menu">
                        <button type="button" onClick={() => requestImageChange(product.id)}><SvgIcon type="image" size={18} /><span>Alterar imagem</span></button>
                        <button type="button" className="product-actions__delete" onClick={() => handleDelete(product)}><SvgIcon type="trash" size={18} /><span>Excluir produto</span></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="products-pagination"><span>Mostrando {filtered.length} de {products.length} produto{products.length === 1 ? '' : 's'}</span><div><button><SvgIcon type="left" /></button><button className="is-current">1</button><button><SvgIcon type="right" /></button></div></div>
          </>
        ) : (
          <div className="products-no-results">Nenhum produto encontrado com os filtros atuais.</div>
        )}
      </div>

      <input ref={imageInputRef} className="visually-hidden-file" type="file" accept="image/*" onChange={handleImageChange} />

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="new-product-title">
            <div className="product-modal__header"><div><h2 id="new-product-title">Novo produto</h2><p>Cadastre um item no estoque.</p></div><button onClick={() => setModalOpen(false)} aria-label="Fechar"><SvgIcon type="close" /></button></div>
            <form onSubmit={handleSubmit} className="product-modal__form">
              <label>Nome<input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} /></label>
              <label>Marca<input value={form.brand} onChange={e => setForm({...form, brand:e.target.value})} /></label>
              <label>Código<input required value={form.code} onChange={e => setForm({...form, code:e.target.value})} /></label>
              <label>Categoria<input value={form.category} onChange={e => setForm({...form, category:e.target.value})} /></label>
              <label>Estoque atual<input type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock:e.target.value})} /></label>
              <label>Estoque mínimo<input type="number" min="0" value={form.minStock} onChange={e => setForm({...form, minStock:e.target.value})} /></label>
              <label>Validade<input placeholder="dd/mm/aaaa" value={form.expiry} onChange={e => setForm({...form, expiry:e.target.value})} /></label>
              <label>Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}><option>Ativo</option><option>Inativo</option></select></label>
              <div className="product-modal__actions"><button type="button" className="btn btn--outline" onClick={() => setModalOpen(false)}>Cancelar</button><button className="btn btn--primary" type="submit">Cadastrar produto</button></div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
