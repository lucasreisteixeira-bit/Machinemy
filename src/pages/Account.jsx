import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mascot from '../assets/machinemy-mascot.png'
import { useInventory } from '../context/InventoryContext'
import '../styles/inventory-pages.css'

export default function Account(){
  const navigate=useNavigate()
  const {profile,updateProfile,theme,setTheme,signOut}=useInventory()
  const [editing,setEditing]=useState(false)
  const [draft,setDraft]=useState(profile)
  const [error,setError]=useState('')

  useEffect(()=>setDraft(profile),[profile])

  const save=async()=>{
    setError('')
    try{ await updateProfile(draft); setEditing(false) }
    catch(err){ setError(err.message||'Não foi possível salvar o perfil.') }
  }
  const cancel=()=>{setDraft(profile);setEditing(false);setError('')}
  const logout=async()=>{try{await signOut()}finally{navigate('/login')}}

  return <div className="page-shell"><div className="page-heading"><div><h1>♙ &nbsp; Minha conta</h1><p>Gerencie suas informações e preferências.</p></div>{editing?<div className="heading-actions"><button className="outline-btn" onClick={cancel}>Cancelar</button><button className="primary-btn" onClick={save}>Salvar perfil</button></div>:<button className="outline-btn" onClick={()=>setEditing(true)}>✎ &nbsp; Editar perfil</button>}</div>
  {error&&<div className="success-banner" style={{borderColor:'#d33'}}><span>!</span><div><b>Erro</b><p>{error}</p></div></div>}
  <section className="panel profile-card"><div className="profile-main"><div className="avatar-wrap"><img src={mascot} alt="Perfil"/></div><div><h2>{profile.name || 'Seu nome'}</h2><p>{profile.email || 'Seu e-mail'}</p><span className="badge badge--orange">{profile.role || 'Gerente de Estoque'}</span><small>▣ &nbsp; Membro desde {profile.memberSince ? new Date(`${profile.memberSince}T12:00:00`).toLocaleDateString('pt-BR') : '—'}</small></div></div><div className="profile-status"><p><b>◷ &nbsp; Último acesso</b><span>{new Date().toLocaleString('pt-BR')}</span></p><p><b>♢ &nbsp; Status da conta</b><span className="badge badge--green">{profile.status || 'Ativa'}</span></p></div></section>
  <section className="account-grid"><div><h3 className="section-title">Informações pessoais</h3><div className="form-grid form-grid--2"><label>Nome completo<input value={editing?draft.name:profile.name} readOnly={!editing} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="Digite seu nome"/></label><label>E-mail<input value={editing?draft.email:profile.email} readOnly={!editing} onChange={e=>setDraft({...draft,email:e.target.value})} placeholder="Digite seu e-mail"/></label><label>Telefone<input value={editing?draft.phone:profile.phone} readOnly={!editing} onChange={e=>setDraft({...draft,phone:e.target.value})} placeholder="Digite seu telefone"/></label><label>Cargo<input value={editing?draft.role:profile.role} readOnly={!editing} onChange={e=>setDraft({...draft,role:e.target.value})} placeholder="Digite seu cargo"/></label><label>Membro desde<input type="date" value={profile.memberSince||''} readOnly/></label></div><hr/><h3 className="section-title">⚙ &nbsp; Preferências</h3><div className="form-grid form-grid--2"><label>Tema<select value={theme} onChange={e=>setTheme(e.target.value)}><option value="light">Claro</option><option value="dark">Escuro</option></select></label><label>Idioma<select><option>Português</option></select></label></div></div><aside><div className="panel side-panel"><h2>♢ &nbsp; Função e permissões</h2><p><b>Sua função</b></p><span className="badge badge--orange">{profile.role || 'Gerente de Estoque'}</span><h4>Principais permissões</h4>{['Visualizar todos os produtos','Registrar entradas e saídas','Gerenciar estoque','Cadastrar produtos','Visualizar relatórios'].map(x=><p className="permission" key={x}>✓ &nbsp; {x}</p>)}</div><div className="panel side-panel management"><h2>♙ &nbsp; Gerenciamento da conta</h2><button className="danger" onClick={logout}>▣ <span><b>Sair da conta</b><small>Encerrar sessão atual</small></span>›</button></div></aside></section></div>
}
