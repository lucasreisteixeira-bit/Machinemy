import { useMemo, useRef, useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

const CATEGORY_OPTIONS = [
  'Alimentos',
  'Bebidas',
  'Cereais',
  'Laticínios',
  'Carnes',
  'Frios e embutidos',
  'Hortifruti',
  'Padaria',
  'Congelados',
  'Mercearia',
  'Higiene',
  'Limpeza',
  'Outros',
]

const blank = {
  name: '',
  brand: '',
  code: '',
  category: 'Alimentos',
  stock: '',
  minStock: '',
  expiry: '',
  status: 'Ativo',
  image: '',
}

export default function Products(){
  const {products,addProduct,deleteProduct,updateProduct,uploadProductImage}=useInventory()
  const [query,setQuery]=useState('')
  const [category,setCategory]=useState('Todas')
  const [status,setStatus]=useState('Todos')
  const [open,setOpen]=useState(false)
  const [form,setForm]=useState(blank)
  const [menu,setMenu]=useState(null)
  const [editingId,setEditingId]=useState(null)
  const fileRef=useRef(null)
  const selectedId=useRef(null)

  const filterCategories = useMemo(() => {
    const current = products.map(p => p.category).filter(Boolean)
    return [...new Set([...CATEGORY_OPTIONS, ...current])]
  }, [products])

  const filtered=useMemo(()=>products.filter(p=>{
    const q=query.toLowerCase()
    const matches=!q||[p.name,p.code,p.category,p.brand].some(v=>String(v||'').toLowerCase().includes(q))
    return matches&&(category==='Todas'||p.category===category)&&(status==='Todos'||p.status===status)
  }),[products,query,category,status])

  const openNewProduct=()=>{
    setEditingId(null)
    setForm(blank)
    setOpen(true)
    setMenu(null)
  }

  const openEditProduct=(product)=>{
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      code: product.code || '',
      category: product.category || 'Alimentos',
      stock: product.stock ?? '',
      minStock: product.minStock ?? '',
      expiry: product.expiry || '',
      status: product.status || 'Ativo',
      image: product.image || '',
    })
    setOpen(true)
    setMenu(null)
  }

  const closeModal=()=>{
    setOpen(false)
    setEditingId(null)
    setForm(blank)
  }

  const [error,setError]=useState('')

  const submit=async e=>{
    e.preventDefault()
    setError('')
    if(!form.name||!form.code)return

    const normalized = {
      ...form,
      stock:Number(form.stock||0),
      minStock:Number(form.minStock||0),
    }

    try {
      if(editingId!==null){
        await updateProduct(editingId, normalized)
      } else {
        await addProduct(normalized)
      }
      closeModal()
    } catch(err) {
      setError(err.message || 'Não foi possível salvar o produto.')
    }
  }

  const imageChange=async e=>{
    const f=e.target.files?.[0]
    if(!f)return
    try {
      await uploadProductImage(selectedId.current, f)
    } catch(err) {
      alert(err.message || 'Não foi possível enviar a imagem.')
    } finally {
      e.target.value=''
    }
  }

  return <div className="page-shell">
    <div className="page-heading">
      <div><h1>▣ &nbsp; Produtos</h1><p>Veja e gerencie todos os produtos cadastrados no estoque.</p></div>
      <div className="heading-actions"><button className="outline-btn">⌁ &nbsp; Filtros</button><button className="primary-btn" onClick={openNewProduct}>＋ Novo produto</button></div>
    </div>

    <div className="filters-row">
      <div className="search-field">⌕ <input placeholder="Buscar produto por nome, código ou categoria..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        <option>Todas</option>
        {filterCategories.map(c=><option key={c}>{c}</option>)}
      </select>
      <select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option><option>Ativo</option><option>Inativo</option></select>
    </div>

    <section className="panel products-table">
      <div className="table-scroll">
        <table className="data-table">
          <thead><tr><th>Produto</th><th>Código</th><th>Categoria</th><th>Estoque atual</th><th>Estoque mínimo</th><th>Validade</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>{filtered.length?filtered.map(p=><tr key={p.id}>
            <td><div className="product-cell">{p.image?<img src={p.image} alt=""/>:<span className="product-placeholder">▣</span>}<div><b>{p.name}</b><small>Marca: {p.brand||'—'}</small></div></div></td>
            <td>{p.code}</td><td>{p.category}</td><td><b className={p.stock<p.minStock?'negative':'positive'}>{p.stock} un</b></td><td>{p.minStock} un</td><td>{p.expiry?new Date(`${p.expiry}T00:00:00`).toLocaleDateString('pt-BR'):'—'}</td><td><span className={`badge ${p.status==='Ativo'?'badge--green':'badge--gray'}`}>{p.status}</span></td>
            <td className="actions-cell">
              <button onClick={()=>setMenu(menu===p.id?null:p.id)}>⋮</button>
              {menu===p.id&&<div className="kebab-menu">
                <button onClick={()=>openEditProduct(p)}>Editar produto</button>
                <button onClick={()=>{selectedId.current=p.id;fileRef.current?.click();setMenu(null)}}>Alterar imagem</button>
                <button className="danger" onClick={async()=>{if(confirm(`Excluir ${p.name}?`)){try{await deleteProduct(p.id)}catch(err){alert(err.message||'Não foi possível excluir.')}}setMenu(null)}}>Excluir produto</button>
              </div>}
            </td>
          </tr>):<tr><td colSpan="8"><div className="empty-state"><span>▣</span><h3>Nenhum produto cadastrado ainda.</h3><p>Clique em “Novo produto” para cadastrar o primeiro item.</p><button className="primary-btn" onClick={openNewProduct}>＋ Novo produto</button></div></td></tr>}</tbody>
        </table>
      </div>
    </section>

    <input ref={fileRef} type="file" accept="image/*" hidden onChange={imageChange}/>

    {open&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeModal()}}>
      <form className="modal-card" onSubmit={submit}>
        <div className="modal-head"><h2>{editingId!==null?'Editar produto':'Novo produto'}</h2><button type="button" onClick={closeModal}>×</button></div>
        <div className="form-grid form-grid--2">
          <label>Nome<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
          <label>Marca<input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/></label>
          <label>Código<input value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/></label>
          <label>Categoria
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {CATEGORY_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>Estoque atual<input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></label>
          <label>Estoque mínimo<input type="number" min="0" value={form.minStock} onChange={e=>setForm({...form,minStock:e.target.value})}/></label>
          <label>Validade<input type="date" value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})}/></label>
          <label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Ativo</option><option>Inativo</option></select></label>
        </div>
        {error&&<p className="form-error">{error}</p>}
        <button className="primary-btn modal-submit">{editingId!==null?'Salvar alterações':'Cadastrar produto'}</button>
      </form>
    </div>}
  </div>
}
