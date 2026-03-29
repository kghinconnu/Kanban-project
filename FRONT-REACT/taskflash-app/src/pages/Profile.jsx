import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'
import toast from 'react-hot-toast'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function Profile() {
  const { user, fetchMe } = useAuthStore()
  const navigate = useNavigate()
  const [name, setName]       = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/auth/profile', { name })
      await fetchMe()
      toast.success('Profil mis à jour !')
      navigate('/dashboard')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)', color: 'var(--t1)' }}>
      <nav className="border-b backdrop-blur sticky top-0 z-10" style={{ background: 'var(--nav)', borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')}
              className="text-sm px-3 py-1.5 rounded-lg transition"
              style={{ color: 'var(--t2)' }}>
              ← Retour
            </button>
            <span className="font-semibold text-sm" style={{ color: 'var(--t1)' }}>Mon profil</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="rounded-2xl p-8 border" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg" style={{ color: 'var(--t1)' }}>{user?.name}</p>
              <p className="text-sm" style={{ color: 'var(--t2)' }}>{user?.email}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--t2)' }}>Nom d'affichage</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                style={{ background: 'var(--input)', border: '1px solid var(--input-border)', color: 'var(--t1)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--t2)' }}>Email</label>
              <input value={user?.email} disabled
                className="w-full rounded-xl px-4 py-3 cursor-not-allowed"
                style={{ background: 'var(--input)', border: '1px solid var(--border)', color: 'var(--t3)' }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--t3)' }}>L'email ne peut pas être modifié</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 rounded-xl text-sm transition border"
                style={{ borderColor: 'var(--border)', color: 'var(--t2)' }}>
                Annuler
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                {loading ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}