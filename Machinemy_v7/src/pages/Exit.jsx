import { useMemo, useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

const todayISO = () => new Date().toISOString().slice(0,10)

export default function Exit() {
  const { products, exits, addExit } = useInventory()
  const [form, setForm] = useState({ productId:'', quantity:'', date:todayISO(), responsible:'', reason:'', unitValue:'', notes:'' })

  const submit=async(e)=>{
    e.preventDefault()
    const p=products.find(x=>x.id===Number(form.productId))
    if(!p||!form.quantity)return
    if(Number(form.quantity)>Number(p.stock)){alert('Quantidade maior que o estoque disponível.');return}
    const quantity=Number(form.quantity), unitValue=Number(form.unitValue||0)
    try {
      await addExit({...form,quantity,unitValue})
      setForm({ productId:'', quantity:'', date:todayISO(), responsible:'', reason:'', unitValue:'', notes:'' })
    } catch (err) {
      alert(err.message || 'Não foi possível registrar a saída.')
    }
  }

  const totalQty=useMemo(()=>exits.reduce((s,x)=>s+Number(x.quantity||0),0),[exits])
  const totalValue=useMemo(()=>exits.reduce((s,x)=>s+Number(x.value||0),0),[exits])
  const lastExit=exits[0]

  const categoryData=useMemo(()=>{
    const map=new Map()
    exits.forEach(e=>{const p=products.find(p=>p.id===Number(e.productId));const cat=p?.category||'Outros';map.set(cat,(map.get(cat)||0)+Number(e.quantity||0))})
    return [...map.entries()].sort((a,b)=>b[1]-a[1])
  },[exits,products])

  const last7=useMemo(()=>{
    const days=[]
    for(let i=6;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);days.push({date:d,label:d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),value:0})}
    exits.forEach(e=>{if(!e.createdAt)return;const d=new Date(e.createdAt);d.setHours(0,0,0,0);const row=days.find(x=>x.date.getTime()===d.getTime());if(row)row.value+=Number(e.quantity||0)})
    return days
  },[exits])
  const maxDay=Math.max(1,...last7.map(x=>x.value))

  return <div className="page-shell"><div className="page-heading"><div><h1>Saída de produtos</h1><p>Acompanhe os produtos que já saíram e foram vendidos.</p></div><button className="primary-btn" onClick={()=>document.getElementById('exit-product')?.focus()}>＋ Nova saída</button></div>
    <section className="stats-grid stats-grid--4"><Metric icon="⇧" label="Total de saídas" value={exits.length} sub="registros"/><Metric icon="🛒" label="Quantidade total saída" value={totalQty.toLocaleString('pt-BR')} sub="unidades"/><Metric icon="▣" label="Última saída" value={lastExit?.date||'—'} sub={lastExit?.product||'Nenhuma saída'}/><Metric icon="↗" label="Valor total" value={totalValue.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} sub="valor informado"/></section>
    <form className="panel movement-form movement-form--orange" onSubmit={submit}><h2>Registrar nova saída</h2><div className="form-grid form-grid--4"><label>Produto<select id="exit-product" value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})}><option value="">Selecione o produto...</option>{products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.stock} un)</option>)}</select></label><label>Quantidade<input type="number" min="1" placeholder="Ex: 10" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/></label><label>Data da saída<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Responsável<input placeholder="Nome do responsável" value={form.responsible} onChange={e=>setForm({...form,responsible:e.target.value})}/></label></div><div className="form-grid form-grid--4"><label>Motivo / Destino (opcional)<input placeholder="Ex: Venda, pedido, transferência..." value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/></label><label>Valor unitário (opcional)<input type="number" min="0" step="0.01" placeholder="Ex: 7,90" value={form.unitValue} onChange={e=>setForm({...form,unitValue:e.target.value})}/></label><label>Observações (opcional)<input placeholder="Informações adicionais" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label></div><div className="form-actions"><button className="primary-btn" type="submit">▣ &nbsp; Registrar saída</button></div></form>
    <section className="charts-row"><div className="panel mini-donut-panel"><h2>Saídas por categoria</h2><div className="donut donut--sales"><div className="donut-center"><b>{totalQty.toLocaleString('pt-BR')}</b><span>unidades</span></div></div><div className="legend sales-legend">{categoryData.length?categoryData.map(([cat,qty])=><p key={cat}><i className="legend-dot orange"/>{cat} <b>{totalQty?Math.round(qty/totalQty*100):0}%</b></p>):<p>Sem dados de saída.</p>}</div></div><div className="panel weekly-chart"><h2>Saídas por dia <small>(últimos 7 dias)</small></h2><div className="week-bars">{last7.map((d,i)=><div key={i}><b>{d.value}</b><span style={{height:`${Math.max(2,d.value/maxDay*100)}%`}}></span><small>{d.label}</small></div>)}</div></div></section>
    <section className="panel table-panel"><div className="panel-title-row"><h2>Saídas recentes</h2></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Data</th><th>Produto</th><th>Quantidade</th><th>Motivo / Destino</th><th>Responsável</th><th>Valor total</th><th></th></tr></thead><tbody>{exits.length?exits.slice(0,5).map(e=><tr key={e.id}><td>{e.date}</td><td><b>{e.product}</b></td><td><span className="qty-pill">{e.quantity}</span> un</td><td>{e.reason||'—'}</td><td>{e.responsible||'—'}</td><td>{Number(e.value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td><td>⋮</td></tr>):<tr><td colSpan="7">Nenhuma saída registrada ainda.</td></tr>}</tbody></table></div></section>
  </div>
}
function Metric({icon,label,value,sub}){return <article className="stat-card"><span className="stat-icon stat-icon--orange">{icon}</span><div><small>{label}</small><strong>{value}</strong><span>{sub}</span></div></article>}
