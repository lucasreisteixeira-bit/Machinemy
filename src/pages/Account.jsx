import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { EyeIcon, EyeOffIcon } from '../components/icons/LoginIcons'
import '../styles/account.css'

function Icon({ type, size = 22 }) {
  const p = { width:size,height:size,viewBox:'0 0 24 24',fill:'none','aria-hidden':true }
  const s = { stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round' }
  const map = {
    user:<><circle {...s} cx="12" cy="7" r="4"/><path {...s} d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
    pencil:<><path {...s} d="m4 20 4.4-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path {...s} d="m14.5 7.5 3 3"/></>,
    camera:<><rect {...s} x="3" y="6" width="18" height="14" rx="2"/><path {...s} d="m8 6 1.3-2h5.4L16 6"/><circle {...s} cx="12" cy="13" r="3"/></>,
    clock:<><circle {...s} cx="12" cy="12" r="9"/><path {...s} d="M12 7v5l3 2"/></>,
    shield:<><path {...s} d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"/></>,
    calendar:<><rect {...s} x="3" y="5" width="18" height="16" rx="2"/><path {...s} d="M7 3v4M17 3v4M3 10h18"/></>,
    lock:<><rect {...s} x="5" y="10" width="14" height="11" rx="2"/><path {...s} d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    gear:<><circle {...s} cx="12" cy="12" r="3"/><path {...s} d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></>,
    sun:<><circle {...s} cx="12" cy="12" r="4"/><path {...s} d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    globe:<><circle {...s} cx="12" cy="12" r="9"/><path {...s} d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    users:<><circle {...s} cx="9" cy="8" r="3"/><path {...s} d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path {...s} d="M16 6a3 3 0 0 1 0 6M17 14c2.3.6 4 2.6 4 5"/></>,
    key:<><circle {...s} cx="8" cy="15" r="4"/><path {...s} d="m11 12 8-8M15 8l2 2M17 6l2 2"/></>,
    trash:<><path {...s} d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
    right:<path {...s} d="m10 7 5 5-5 5"/>,
    check:<path {...s} d="m5 12 4 4 10-10"/>,
    down:<path {...s} d="m8 10 4 4 4-4"/>,
  }
  return <svg {...p}>{map[type]}</svg>
}

function Field({ label, children }) { return <label className="account-field"><span>{label}</span>{children}</label> }

export default function Account() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [avatar, setAvatar] = useState(null)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({ name:'João da Silva', email:'joao.silva@machinemy.com', phone:'(11) 99999-9999', role:'Gerente de Estoque' })
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [theme, setTheme] = useState('Claro')
  const [language, setLanguage] = useState('Português')

  const chooseAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  const changePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) return alert('Digite duas senhas iguais para continuar.')
    alert('Senha alterada com sucesso.')
    setNewPassword(''); setConfirmPassword('')
  }

  return (
    <section className="account-page">
      <div className="page-heading account-page__heading">
        <div className="page-heading__left"><div className="page-heading__icon"><Icon type="user" size={42}/></div><div><h1>Minha conta</h1><p>Gerencie suas informações e preferências.</p></div></div>
        <button className="account-edit-btn" onClick={() => setEditing(v=>!v)}><Icon type="pencil" />{editing ? 'Concluir edição' : 'Editar perfil'}</button>
      </div>

      <div className="account-profile-card">
        <div className="account-profile-card__identity">
          <div className="account-avatar">
            {avatar ? <img src={avatar} alt="Avatar"/> : <Mascot size={118}/>} 
            <button className="account-avatar__camera" onClick={() => fileRef.current?.click()} aria-label="Alterar foto"><Icon type="camera" size={18}/></button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={chooseAvatar}/>
          </div>
          <div className="account-profile-card__identity-text"><h2>{profile.name}</h2><p>{profile.email}</p><span className="role-badge">{profile.role}</span><div className="member-since"><Icon type="calendar" size={18}/>Membro desde 15/02/2024</div></div>
        </div>
        <div className="account-profile-card__meta">
          <div><Icon type="clock"/><span><strong>Último acesso</strong><small>13/05/2025 às 09:32</small></span></div>
          <div><Icon type="shield"/><span><strong>Status da conta</strong><small><b className="active-badge">Ativa</b></small></span></div>
        </div>
      </div>

      <div className="account-grid">
        <div className="account-main-column">
          <section className="account-section"><h3>Informações pessoais</h3><div className="account-fields-grid">
            <Field label="Nome completo"><input disabled={!editing} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></Field>
            <Field label="E-mail"><input disabled={!editing} value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})}/></Field>
            <Field label="Telefone"><input disabled={!editing} value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})}/></Field>
            <Field label="Cargo"><input disabled={!editing} value={profile.role} onChange={e=>setProfile({...profile,role:e.target.value})}/></Field>
          </div></section>

          <section className="account-section account-section--security"><h3><Icon type="lock"/>Segurança</h3><div className="security-row">
            <Field label="Nova senha"><div className="password-field"><input type={show1?'text':'password'} value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Digite uma nova senha"/><button onClick={()=>setShow1(v=>!v)}>{show1?<EyeOffIcon/>:<EyeIcon/>}</button></div></Field>
            <Field label="Confirmar nova senha"><div className="password-field"><input type={show2?'text':'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Confirme a nova senha"/><button onClick={()=>setShow2(v=>!v)}>{show2?<EyeOffIcon/>:<EyeIcon/>}</button></div></Field>
            <button className="account-outline-action" onClick={changePassword}>Alterar senha</button>
          </div></section>

          <section className="account-section account-section--preferences"><h3><Icon type="gear"/>Preferências</h3><div className="preferences-row">
            <Field label="Tema"><div className="account-select"><Icon type="sun"/><select value={theme} onChange={e=>setTheme(e.target.value)}><option>Claro</option><option>Escuro</option></select><Icon type="down"/></div></Field>
            <Field label="Idioma"><div className="account-select"><Icon type="globe"/><select value={language} onChange={e=>setLanguage(e.target.value)}><option>Português</option><option>English</option><option>Español</option></select><Icon type="down"/></div></Field>
          </div></section>
        </div>

        <aside className="account-side-column">
          <section className="account-side-card permissions-card"><h3><Icon type="shield"/>Função e permissões</h3><strong>Sua função</strong><span className="role-badge">Gerente de Estoque</span><strong className="permissions-title">Principais permissões</strong><ul>{['Visualizar todos os produtos','Registrar entradas e saídas','Gerenciar estoque','Cadastrar produtos','Visualizar relatórios','Gerenciar usuários'].map(item=><li key={item}><Icon type="check" size={18}/>{item}</li>)}</ul><button>Ver todas as permissões</button></section>
          <section className="account-side-card management-card"><h3><Icon type="users"/>Gerenciamento da conta</h3><button className="management-item"><Icon type="key"/><span><strong>Gerenciar sessões</strong><small>Veja os dispositivos conectados</small></span><Icon type="right"/></button><button className="management-item management-item--danger" onClick={()=>navigate('/login')}><Icon type="trash"/><span><strong>Sair da conta</strong><small>Encerrar sessão atual</small></span><Icon type="right"/></button></section>
        </aside>
      </div>
    </section>
  )
}
