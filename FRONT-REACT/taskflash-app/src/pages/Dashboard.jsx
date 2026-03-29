import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useGroupStore from '../store/groupStore'
import GroupCard from '../components/groups/GroupCard'
import CreateGroupModal from '../components/groups/CreateGroupModal'
import JoinGroupModal from '../components/groups/JoinGroupModal'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function Dashboard() {
  const { user, fetchMe, logout } = useAuthStore()
  const { groups, fetchGroups }   = useGroupStore()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)

  useEffect(() => { fetchMe(); fetchGroups() }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)', color: 'var(--t1)' }}>
      <nav className="border-b backdrop-blur sticky top-0 z-10 transition-colors duration-300"
        style={{ background: 'var(--nav)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/30 text-white">T</div>
            <span className="font-bold text-lg" style={{ color: 'var(--t1)' }}>TaskFlash</span>
          </div>
          <div className="flex items-center gap-3">
            <div onClick={() => navigate('/profile')}
              className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg transition hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm hidden sm:block" style={{ color: 'var(--t2)' }}>{user.name}</span>
            </div>
            <ThemeToggle />
            <button onClick={handleLogout}
              className="text-sm transition px-3 py-1.5 rounded-lg"
              style={{ color: 'var(--t2)' }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--t1)' }}>Bonjour, {user.name} 👋</h1>
          <p className="mt-1" style={{ color: 'var(--t2)' }}>Gère tes projets collaboratifs</p>
        </div>
        <div className="flex gap-3 mb-8 flex-wrap">
          <button onClick={() => setModal('create')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-blue-600/20">
            <span className="text-lg leading-none">+</span> Créer un groupe
          </button>
          <button onClick={() => setModal('join')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition border"
            style={{ borderColor: 'var(--border)', color: 'var(--t2)', background: 'transparent' }}>
            Rejoindre avec un code
          </button>
        </div>
        {groups.length === 0 ? (
          <div className="text-center py-24 border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            <div className="text-4xl mb-4">🚀</div>
            <p className="font-medium" style={{ color: 'var(--t1)' }}>Aucun groupe pour l'instant</p>
            <p className="text-sm mt-1" style={{ color: 'var(--t2)' }}>Crée un groupe ou rejoins-en un avec un code</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => <GroupCard key={g.id} group={g} />)}
          </div>
        )}
      </div>

      {modal === 'create' && <CreateGroupModal onClose={() => setModal(null)} onCreated={() => fetchGroups()} />}
      {modal === 'join' && <JoinGroupModal onClose={() => setModal(null)} onJoined={() => fetchGroups()} />}
    </div>
  )
}