import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const { register, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await register(form.name, form.email, form.password, form.password_confirmation)
    if (ok) navigate('/dashboard')
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>Créer un compte</h1>
      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="name"     placeholder="Nom"              value={form.name}     onChange={handleChange} required />
        <input name="email"    placeholder="Email"     type="email"   value={form.email}    onChange={handleChange} required />
        <input name="password" placeholder="Mot de passe" type="password" value={form.password} onChange={handleChange} required />
        <input name="password_confirmation" placeholder="Confirmer" type="password" value={form.password_confirmation} onChange={handleChange} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Chargement...' : "S'inscrire"}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </div>
  )
}