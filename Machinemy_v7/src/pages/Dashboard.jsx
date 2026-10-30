import { Link } from 'react-router-dom'
import mascot from '../assets/machinemy-mascot.png'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

const isToday = (iso) => {
  if (!iso) return false
  const d = new Date(iso), now = new Date()
  return d.toDateString() === now.toDateString()
}

export default function Dashboard() {
  const { products, alerts, entries, exits, bestSellers, profile } = useInventory()
  const entriesToday = entries.filter(x => isToday(x.createdAt)).length
  const exitsToday = exits.filter(x => isToday(x.createdAt)).length
  const recent = [
    ...entries.map((x) => ({ ...x, type: 'Entrada', qty: `+${x.quantity}` })),
    ...exits.map((x) => ({ ...x, type: 'Saída', qty: `-${x.quantity}` })),
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5)
  const firstName = profile.name?.trim()?.split(' ')[0]

  return <div className="page-shell home-page">
    <div className="page-heading page-heading--compact"><div><h1>{firstName ? `Bem-vindo de volta, ${firstName}! 👋` : 'Bem-vindo! 👋'}</h1><p>Veja o que está acontecendo no seu estoque hoje.</p></div></div>
    <section className="stats-grid stats-grid--4">
      <Stat icon="▣" label="Produtos cadastrados" value={products.length.toLocaleString('pt-BR')} foot="Dados atuais" tone="amber" />
      <Stat icon="△" label="Alertas ativos" value={alerts.length} foot="Verifique agora" tone="orange" />
      <Stat icon="⇩" label="Entradas hoje" value={entriesToday} foot="Registros de hoje" tone="green" />
      <Stat icon="⇧" label="Saídas hoje" value={exitsToday} foot="Registros de hoje" tone="orange" />
    </section>
    <section className="home-columns">
      <div className="panel"><h2>Movimentações recentes</h2><div className="movement-list">
        {recent.length ? recent.map((item) => <div className="movement-row" key={`${item.type}-${item.id}`}><span className={`movement-icon movement-icon--${item.type === 'Entrada' ? 'green' : 'orange'}`}>{item.type === 'Entrada' ? '⇩' : '⇧'}</span><div><strong>{item.type} de produtos</strong><small>{item.product}</small></div><span className="movement-date">{item.date || '—'}</span><b className={item.type === 'Entrada' ? 'positive' : 'negative'}>{item.qty}</b></div>) : <p className="empty-inline">Nenhuma movimentação registrada ainda.</p>}
      </div><Link to="/entrada" className="panel-action">Ver todas</Link></div>
      <div className="panel"><h2>Mais vendidos</h2><div className="ranking-list">{bestSellers.length ? bestSellers.slice(0,5).map((item, i) => <div className="ranking-row" key={item.productId}><span>{i + 1}</span><strong>{item.name}</strong><b>{item.quantity} un.</b></div>) : <p className="empty-inline">Ainda não há saídas suficientes para gerar o ranking.</p>}</div><Link to="/mais-vendidos" className="panel-action">Ver relatório</Link></div>
    </section>
    <section className="promo-banner"><img src={mascot} alt="Mascote Machinemy"/><div><h3>Controle seu estoque com inteligência!</h3><p>Evite perdas, gerencie melhor e aumente seus resultados.</p></div><div className="box-stack">▰▰<br/>▰▰▰</div></section>
  </div>
}

function Stat({ icon, label, value, foot, tone }) {
  return <article className="stat-card"><span className={`stat-icon stat-icon--${tone}`}>{icon}</span><div><small>{label}</small><strong>{value}</strong><span className={`stat-foot stat-foot--${tone}`}>{foot}</span></div></article>
}
