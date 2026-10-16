import { Link } from 'react-router-dom'
import mascot from '../assets/machinemy-mascot.png'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

export default function Dashboard() {
  const { products, alerts, entries, exits } = useInventory()
  const recent = [
    ...entries.slice(0, 3).map((x) => ({ ...x, type: 'Entrada', qty: `+${x.quantity}` })),
    ...exits.slice(0, 2).map((x) => ({ ...x, type: 'Saída', qty: `-${x.quantity}` })),
  ].sort((a, b) => b.id - a.id).slice(0, 5)
  const best = [
    ['Arroz 5kg', 320], ['Óleo de soja 900ml', 280], ['Açúcar 1kg', 250], ['Café 500g', 210], ['Leite integral 1L', 190],
  ]
  return <div className="page-shell home-page">
    <div className="page-heading page-heading--compact"><div><h1>Bem-vindo de volta! 👋</h1><p>Veja o que está acontecendo no seu estoque hoje.</p></div></div>
    <section className="stats-grid stats-grid--4">
      <Stat icon="▣" label="Produtos cadastrados" value={products.length.toLocaleString('pt-BR')} foot="+12 este mês" tone="amber" />
      <Stat icon="△" label="Alertas ativos" value={alerts.length} foot="Verifique agora" tone="orange" />
      <Stat icon="⇩" label="Entradas hoje" value={entries.length} foot="+5 novos" tone="green" />
      <Stat icon="⇧" label="Saídas hoje" value={exits.length} foot="+3 novos" tone="orange" />
    </section>
    <section className="home-columns">
      <div className="panel"><h2>Movimentações recentes</h2><div className="movement-list">
        {recent.map((item) => <div className="movement-row" key={`${item.type}-${item.id}`}><span className={`movement-icon movement-icon--${item.type === 'Entrada' ? 'green' : 'orange'}`}>{item.type === 'Entrada' ? '⇩' : '⇧'}</span><div><strong>{item.type} de produtos</strong><small>{item.product}</small></div><span className="movement-date">28/05/2025</span><b className={item.type === 'Entrada' ? 'positive' : 'negative'}>{item.qty}</b></div>)}
      </div><Link to="/entrada" className="panel-action">Ver todas</Link></div>
      <div className="panel"><h2>Mais vendidos</h2><div className="ranking-list">{best.map(([name, qty], i) => <div className="ranking-row" key={name}><span>{i + 1}</span><strong>{name}</strong><b>{qty} un.</b></div>)}</div><Link to="/mais-vendidos" className="panel-action">Ver relatório</Link></div>
    </section>
    <section className="promo-banner"><img src={mascot} alt="Mascote Machinemy"/><div><h3>Controle seu estoque com inteligência!</h3><p>Evite perdas, gerencie melhor e aumente seus resultados.</p></div><div className="box-stack">▰▰<br/>▰▰▰</div></section>
  </div>
}

function Stat({ icon, label, value, foot, tone }) {
  return <article className="stat-card"><span className={`stat-icon stat-icon--${tone}`}>{icon}</span><div><small>{label}</small><strong>{value}</strong><span className={`stat-foot stat-foot--${tone}`}>{foot}</span></div></article>
}
