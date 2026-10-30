import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import IndustrialWatermarks from '../components/IndustrialWatermarks'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ShieldLockIcon } from '../components/icons/LoginIcons'
import { useInventory } from '../context/InventoryContext'
import '../styles/login.css'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp, isAuthenticated, authLoading } = useInventory()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.')
      return
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'signup') {
        const data = await signUp(email.trim(), password, name.trim())
        if (data.session) {
          navigate('/dashboard')
        } else {
          setMessage('Conta criada. Confirme o e-mail enviado pelo Supabase e depois faça login.')
          setMode('login')
        }
      } else {
        await signIn(email.trim(), password)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <IndustrialWatermarks />
      <div className="login-page__content">
        <header className="login-page__header"><Logo variant="login" showTagline /></header>
        <div className="login-card">
          <div className="login-card__heading">
            <h1>{mode === 'signup' ? 'Crie sua conta' : 'Bem-vindo de volta!'}</h1>
            <p>{mode === 'signup' ? 'Cadastre um usuário para acessar o estoque' : 'Faça login para acessar o sistema'}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {mode === 'signup' && <div className="login-form__field">
              <label htmlFor="name">Nome</label>
              <div className="login-form__input-wrap"><input id="name" placeholder="Digite seu nome" value={name} onChange={(e) => setName(e.target.value)} /></div>
            </div>}

            <div className="login-form__field">
              <label htmlFor="email">E-mail</label>
              <div className="login-form__input-wrap">
                <MailIcon />
                <input id="email" type="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
            </div>

            <div className="login-form__field">
              <label htmlFor="password">Senha</label>
              <div className="login-form__input-wrap">
                <LockIcon />
                <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
                <button type="button" className="login-form__toggle-password" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && <p className="login-form__error">{error}</p>}
            {message && <p className="login-form__success">{message}</p>}
            <button type="submit" className="login-form__submit" disabled={submitting}>{submitting ? 'Aguarde...' : mode === 'signup' ? 'Criar conta' : 'Entrar'}</button>
          </form>

          <div className="login-card__divider"><span className="login-card__divider-line" /><span className="login-card__divider-text">ou</span><span className="login-card__divider-line" /></div>
          <button type="button" className="login-form__secondary" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}>
            {mode === 'login' ? 'Criar uma conta' : 'Já tenho uma conta'}
          </button>
          <div className="login-card__security"><ShieldLockIcon /><span>Acesso seguro e autorizado</span></div>
        </div>
      </div>
    </div>
  )
}
