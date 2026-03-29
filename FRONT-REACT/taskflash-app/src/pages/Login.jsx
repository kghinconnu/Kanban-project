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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--t1)' }}>TaskFlash</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--t2)' }}>Connecte-toi à ton espace</p>
        </div>
        <div className="rounded-2xl p-8 shadow-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--t2)' }}>Email</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="ton@email.com" required
                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                style={{ background: 'var(--input)', border: '1px solid var(--input-border)', color: 'var(--t1)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--t2)' }}>Mot de passe</label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required
                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                style={{ background: 'var(--input)', border: '1px solid var(--input-border)', color: 'var(--t1)' }}
              />
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition mt-2">
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: 'var(--t2)' }}>
            Pas de compte ?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}