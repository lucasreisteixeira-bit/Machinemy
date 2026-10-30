import { useMemo, useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

export default function BestSellers() {
  const { exits, bestSellers, products } = useInventory()
  const [period, setPeriod] = useState('30')

  const filteredExits = useMemo(() => {
    if (period === 'all') return exits
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - Number(period))
    return exits.filter(e => !e.createdAt || new Date(e.createdAt) >= cutoff)
  }, [exits, period])

  const ranking = useMemo(() => {
    const grouped = new Map()
    filteredExits.forEach(e => {
      const key = String(e.productId)
      const row = grouped.get(key) || { productId:e.productId, name:e.product, quantity:0, value:0 }
      row.quantity += Number(e.quantity || 0)
      row.value += Number(e.value || 0)
      grouped.set(key,row)
    })
    return [...grouped.values()].sort((a,b)=>b.quantity-a.quantity)
  }, [filteredExits])

  const top = ranking.slice(0,5)
  const max = Math.max(1, ...top.map(x=>x.quantity))
  const total = ranking.reduce((s,x)=>s+x.quantity,0)
  const leader = ranking[0]
  const categoryTotals = useMemo(() => {
    const map = new Map()
    filteredExits.forEach(e => {
      const p = products.find(p => p.id === Number(e.productId))
      const cat = p?.category || 'Outros'
      map.set(cat,(map.get(cat)||0)+Number(e.quantity||0))
    })
    return [...map.entries()].sort((a,b)=>b[1]-a[1])
  }, [filteredExits, products])
  const leaderCategory = categoryTotals[0]

  return <div className="page-shell"><div className="page-heading"><div><h1>Mais vendidos</h1><p>Ranking calculado a partir das saídas realmente registradas no sistema.</p></div><select className="soft-select" value={period} onChange={e=>setPeriod(e.target.value)}><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option><option value="365">Último ano</option><option value="all">Todo o período</option></select></div>
    <section className="panel chart-panel"><h2>Top 5 produtos mais vendidos</h2>{top.length ? <div className="bar-chart"><div className="y-label">Quantidade vendida</div><div className="bars">{top.map((d) => <div className="bar-wrap" key={d.productId}><b>{d.quantity}</b><div className="bar bar--orange" style={{height: `${Math.max(10,d.quantity / max * 100)}%`}}><span>▣</span></div><small>{d.name}</small></div>)}</div></div> : <div className="empty-state"><h3>Nenhuma saída registrada neste período.</h3><p>Registre saídas para gerar o ranking automaticamente.</p></div>}</section>
    <section className="summary-grid"><Summary icon="🏆" label="Produto líder" value={leader?.name || '—'} sub={leader ? `${leader.quantity} unidades` : 'Sem dados'} tone="warm"/><Summary icon="🛒" label="Total vendido" value={total.toLocaleString('pt-BR')} sub="unidades" tone="mint"/><Summary icon="📊" label="Produtos vendidos" value={ranking.length} sub="produtos diferentes" tone="sky"/><Summary icon="◔" label="Categoria líder" value={leaderCategory?.[0] || '—'} sub={leaderCategory ? `${leaderCategory[1]} unidades` : 'Sem dados'} tone="lavender"/></section>
    <div className="tip-box"><span>💡</span><p><b>Dica:</b> Este relatório não usa dados de exemplo. Ele é atualizado automaticamente conforme você registra novas saídas.</p></div>
  </div>
}
function Summary({icon,label,value,sub,tone}){return <article className={`summary-card summary-card--${tone}`}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><p>{sub}</p></div></article>}
