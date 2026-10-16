import '../styles/inventory-pages.css'

const data = [
  { name: 'Arroz', value: 450, icon: '🍚', tone: 'orange' },
  { name: 'Feijão', value: 380, icon: '🫘', tone: 'yellow' },
  { name: 'Óleo de\nSoja', value: 320, icon: '🫗', tone: 'green' },
  { name: 'Leite', value: 280, icon: '🥛', tone: 'blue' },
  { name: 'Farinha de\nTrigo', value: 260, icon: '🌾', tone: 'purple' },
]

export default function BestSellers() {
  return <div className="page-shell"><div className="page-heading"><div><h1>Mais vendidos</h1><p>Os produtos alimentícios são os mais vendidos da loja.</p></div><select className="soft-select"><option>Últimos 30 dias</option><option>Últimos 7 dias</option><option>Último ano</option></select></div>
    <section className="panel chart-panel"><h2>Top 5 produtos mais vendidos</h2><div className="bar-chart"><div className="y-label">Quantidade vendida</div><div className="chart-grid-lines">{[500,400,300,200,100,0].map(n => <span key={n}><i>{n}</i></span>)}</div><div className="bars">{data.map((d) => <div className="bar-wrap" key={d.name}><b>{d.value}</b><div className={`bar bar--${d.tone}`} style={{height: `${d.value / 500 * 100}%`}}><span>{d.icon}</span></div><small>{d.name.split('\n').map((p,i)=><span key={i}>{p}<br/></span>)}</small></div>)}</div></div></section>
    <section className="summary-grid"><Summary icon="🏆" label="Produto líder" value="Arroz" sub="450 unidades" tone="warm"/><Summary icon="🛒" label="Total vendido" value="1.690" sub="unidades" tone="mint"/><Summary icon="📈" label="Crescimento" value="+18%" sub="em relação ao mês anterior" tone="sky"/><Summary icon="◔" label="Categoria líder" value="Alimentícios" sub="82% das vendas" tone="lavender"/></section>
    <div className="tip-box"><span>💡</span><p><b>Dica:</b> Os produtos alimentícios representam a maior parte das vendas da loja.<br/>Mantenha o estoque sempre abastecido para atender à demanda!</p></div>
  </div>
}
function Summary({icon,label,value,sub,tone}){return <article className={`summary-card summary-card--${tone}`}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><p>{sub}</p></div></article>}
