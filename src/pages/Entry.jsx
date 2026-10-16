import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

export default function Entry() {
  const { products, entries, addEntry } = useInventory()
  const [form, setForm] = useState({ productId: '', quantity: '', date: '2024-05-29', supplier: '', lot: '', expiry: '', notes: '' })
  const [success, setSuccess] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const p = products.find(x => x.id === Number(form.productId))
    if (!p || !form.quantity) return
    addEntry({ ...form, product: p.name, quantity: Number(form.quantity), value: Number(form.quantity) * 5.5, date: `${new Date(form.date).toLocaleDateString('pt-BR')} 08:45`, expiry: form.expiry ? new Date(form.expiry).toLocaleDateString('pt-BR') : '—' })
    setSuccess(true)
    setForm({ productId: '', quantity: '', date: '2024-05-29', supplier: '', lot: '', expiry: '', notes: '' })
  }
  const totalQty = entries.reduce((s,x)=>s+Number(x.quantity),0)
  const totalValue = entries.reduce((s,x)=>s+Number(x.value||0),0)
  return <div className="page-shell"><div className="page-heading"><div><h1>Entrada de produtos</h1><p>Registre aqui os produtos que chegaram ao estoque.</p></div><button className="primary-btn primary-btn--green" onClick={()=>document.getElementById('entry-product')?.focus()}>＋ Nova entrada</button></div>
    <section className="stats-grid stats-grid--4"><Metric icon="▣" label="Total de entradas" value={entries.length} sub="últimos 30 dias" tone="green"/><Metric icon="▰" label="Quantidade total" value={totalQty.toLocaleString('pt-BR')} sub="unidades" tone="green"/><Metric icon="▣" label="Última entrada" value="29/05/2024" sub="Hoje, 08:45" tone="green"/><Metric icon="↗" label="Valor total" value={totalValue.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} sub="últimos 30 dias" tone="green"/></section>
    <form className="panel movement-form movement-form--green" onSubmit={submit}><h2>Registrar nova entrada</h2><div className="form-grid form-grid--4"><label>Produto<select id="entry-product" value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})}><option value="">Selecione o produto...</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Quantidade<input type="number" min="1" placeholder="Ex: 100" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/></label><label>Data de entrada<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Fornecedor<input placeholder="Selecione o fornecedor..." value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/></label></div><div className="form-grid form-grid--entry"><label>Lote (opcional)<input placeholder="Ex: LOTE123" value={form.lot} onChange={e=>setForm({...form,lot:e.target.value})}/></label><label>Validade (opcional)<input type="date" value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})}/></label></div><div className="form-grid form-grid--action"><label>Observações (opcional)<textarea placeholder="Informações adicionais sobre a entrada..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label><button className="primary-btn primary-btn--green" type="submit">⇩ &nbsp; Registrar entrada</button></div></form>
    <RecentEntries entries={entries}/>{success && <div className="success-banner"><span>✓</span><div><b>Entrada registrada com sucesso!</b><p>O estoque foi atualizado automaticamente.</p></div><a href="#/produtos">Ver estoque atualizado ›</a></div>}
  </div>
}
function Metric({icon,label,value,sub,tone}){return <article className="stat-card"><span className={`stat-icon stat-icon--${tone}`}>{icon}</span><div><small>{label}</small><strong>{value}</strong><span>{sub}</span></div></article>}
function RecentEntries({entries}){return <section className="panel table-panel"><div className="panel-title-row"><h2>Entradas recentes</h2><button>Ver todas ›</button></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Data</th><th>Produto</th><th>Quantidade</th><th>Fornecedor</th><th>Lote</th><th>Validade</th><th>Valor total</th><th></th></tr></thead><tbody>{entries.slice(0,5).map(e=><tr key={e.id}><td>{e.date}</td><td><b>{e.product}</b></td><td><span className="qty-pill qty-pill--green">{e.quantity}</span> un</td><td>{e.supplier||'—'}</td><td>{e.lot||'—'}</td><td>{e.expiry||'—'}</td><td>{Number(e.value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td><td>⋮</td></tr>)}</tbody></table></div></section>}
