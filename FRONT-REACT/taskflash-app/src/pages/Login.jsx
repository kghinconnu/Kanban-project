import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(form.email, form.password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>Se connecter</h1>
      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="email"    placeholder="Email"        type="email"    value={form.email}    onChange={handleChange} required />
        <input name="password" placeholder="Mot de passe" type="password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
    </div>
  )
}