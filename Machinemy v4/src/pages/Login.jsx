import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import IndustrialWatermarks from '../components/IndustrialWatermarks'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ShieldLockIcon } from '../components/icons/LoginIcons'
import '../styles/login.css'

const VALID_EMAIL = 'admin@machinemy.com'
const VALID_PASSWORD = '123456'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (email.trim() === VALID_EMAIL && password === VALID_PASSWORD) {
      navigate('/dashboard')
      return
    }

    setError('E-mail ou senha incorretos. Use admin@machinemy.com / 123456')
  }

  const handleForgotPassword = () => {
    alert('Funcionalidade de recuperação de senha em breve.')
  }

  return (
    <div className="login-page">
      <IndustrialWatermarks />

      <div className="login-page__content">
        <header className="login-page__header">
          <Logo variant="login" showTagline />
        </header>

        <div className="login-card">
          <div className="login-card__heading">
            <h1>Bem-vindo de volta!</h1>
            <p>Faça login para acessar o sistema</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form__field">
              <label htmlFor="email">E-mail</label>
              <div className="login-form__input-wrap">
                <MailIcon />
                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-form__field">
              <label htmlFor="password">Senha</label>
              <div className="login-form__input-wrap">
                <LockIcon />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-form__toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="login-form__forgot">
              <button type="button" onClick={handleForgotPassword}>
                Esqueceu sua senha?
              </button>
            </div>

            {error && <p className="login-form__error">{error}</p>}

            <button type="submit" className="login-form__submit">
              Entrar
            </button>
          </form>

          <div className="login-card__divider">
            <span className="login-card__divider-line" />
            <span className="login-card__divider-text">ou</span>
            <span className="login-card__divider-line" />
          </div>

          <div className="login-card__security">
            <ShieldLockIcon />
            <span>Acesso seguro e autorizado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
