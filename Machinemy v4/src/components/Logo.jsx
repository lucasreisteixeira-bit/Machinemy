import mascot from '../assets/machinemy-mascot.png'
import './Logo.css'

export default function Logo({ variant = 'header', showTagline = false }) {
  return (
    <div className={`brand brand--${variant}`}>
      <img src={mascot} alt="Mascote Machinemy" className="brand__mascot" />
      <div className="brand__copy">
        <span className="brand__name">machinemy</span>
        {showTagline && <span className="brand__tagline">GESTÃO INTELIGENTE DE ESTOQUE</span>}
      </div>
    </div>
  )
}
