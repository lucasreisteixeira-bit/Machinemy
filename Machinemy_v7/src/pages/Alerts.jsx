import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

export default function Alerts() {
  const { alerts } = useInventory()
  const [tab, setTab] = useState('Todos')
  const counts = useMemo(() => ({
    'Todos': alerts.length,
    'Estoque baixo': alerts.filter(a => a.alertType === 'Estoque baixo').length,
    'Validade próxima': alerts.filter(a => a.alertType === 'Validade próxima').length,
    'Vencido': alerts.filter(a => a.alertType === 'Vencido').length,
  }), [alerts])
  const shown = tab === 'Todos' ? alerts : alerts.filter(a => a.alertType === tab)
  return <div className="page-shell"><div className="page-heading page-heading--compact"><div><h1>Alertas de estoque</h1><p>Acompanhe os alertas gerados pelos seus próprios produtos cadastrados.</p></div></div>
    <section className="stats-grid stats-grid--4 alert-stats"><AlertStat icon="!" label="Total de alertas" value={counts.Todos} tone="yellow"/><AlertStat icon="!" label="Estoque baixo" value={counts['Estoque baixo']} tone="red"/><AlertStat icon="▣" label="Validade próxima" value={counts['Validade próxima']} tone="orange"/><AlertStat icon="!" label="Produtos vencidos" value={counts.Vencido} tone="purple"/></section>
    <section className="alerts-layout"><div className="panel alerts-table-panel"><div className="tabs">{Object.entries(counts).map(([name,count]) => <button key={name} className={tab===name?'active':''} onClick={()=>setTab(name)}>{name} ({count})</button>)}</div><h2>Alertas recentes</h2><div className="table-scroll"><table className="data-table"><thead><tr><th>Produto</th><th>Tipo de alerta</th><th>Detalhes</th><th>Quantidade</th><th>Data / Validade</th><th>Ação</th></tr></thead><tbody>{shown.length?shown.map(a => <tr key={`${a.id}-${a.alertType}`}><td><b>{a.name}</b></td><td><span className={`badge badge--${a.alertTone}`}>{a.alertType}</span></td><td>{a.detail}</td><td><b className={a.alertTone==='red'?'negative':'warning-text'}>{a.stock} un</b></td><td>{a.dateLabel}</td><td><Link className="outline-btn small" to="/produtos">Ver produto</Link></td></tr>):<tr><td colSpan="6">Nenhum alerta ativo no momento.</td></tr>}</tbody></table></div></div>
      <aside><div className="panel side-panel"><h2>Tipos de alerta</h2><TypeRow icon="▲" title="Estoque baixo" text="Produtos com quantidade abaixo do mínimo definido." count={counts['Estoque baixo']}/><TypeRow icon="▣" title="Validade próxima" text="Produtos que vencem nos próximos 15 dias." count={counts['Validade próxima']}/><TypeRow icon="!" title="Vencidos" text="Produtos com a data de validade já vencida." count={counts.Vencido}/></div><div className="tip-box tip-box--side"><span>💡</span><p><b>Dica importante</b><br/>Os alertas são calculados automaticamente a partir dos dados dos seus produtos.</p></div></aside>
    </section>
    <section className="alerts-bottom"><div className="panel donut-panel"><h2>Resumo de alertas</h2><div className="donut"><div className="donut-center"><b>{alerts.length}</b><span>alertas</span></div></div><div className="legend"><p><i className="legend-dot red"/>Estoque baixo <b>{counts['Estoque baixo']}</b></p><p><i className="legend-dot orange"/>Validade próxima <b>{counts['Validade próxima']}</b></p><p><i className="legend-dot darkred"/>Vencidos <b>{counts.Vencido}</b></p></div></div><div className="panel recommendation"><h2>▣ &nbsp; Recomendações</h2><p>✓ &nbsp; Reabasteça os produtos com estoque baixo para evitar ruptura.</p><p>✓ &nbsp; Priorize a venda dos produtos com validade próxima.</p><p>✓ &nbsp; Verifique os produtos vencidos e tome as devidas providências.</p></div></section>
  </div>
}
function AlertStat({icon,label,value,tone}){return <article className="stat-card"><span className={`alert-orb alert-orb--${tone}`}>{icon}</span><div><small>{label}</small><strong>{value}</strong><span>itens</span></div></article>}
function TypeRow({icon,title,text,count}){return <div className="type-row"><span>{icon}</span><div><b>{title}</b><small>{text}</small></div><strong>{count}</strong></div>}
