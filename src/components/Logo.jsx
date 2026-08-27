import Mascot from './Mascot'
import './Logo.css'

export default function Logo({ variant = 'login', showTagline = true }) {
  const isLogin = variant === 'login'

  return (
    <div className={`logo ${isLogin ? 'logo--login' : 'logo--header'}`}>
      <Mascot size={isLogin ? 132 : 104} className="logo__mascot" />
      <div className="logo__text-group">
        <span className="logo__name">machinemy</span>
        {showTagline && isLogin && (
          <span className="logo__tagline">GESTÃO INTELIGENTE DE ESTOQUE</span>
        )}
      </div>
    </div>
  )
}
