import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useGroupStore from '../store/groupStore'
import GroupCard from '../components/groups/GroupCard'
import CreateGroupModal from '../components/groups/CreateGroupModal'
import JoinGroupModal from '../components/groups/JoinGroupModal'

export default function Dashboard() {
  const { user, fetchMe, logout } = useAuthStore()
  const { groups, fetchGroups } = useGroupStore()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null) // 'create' | 'join' | null

  useEffect(() => {
    fetchMe()
    fetchGroups()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return <p style={{ padding: 40 }}>Chargement...</p>
  console.log('modal state:', modal)

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>TaskFlash</h1>
          <p style={styles.sub}>Bonjour, {user.name} 👋</p>
        </div>
        <button onClick={handleLogout} style={styles.btnLogout}>Déconnexion</button>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={() => setModal('create')} style={styles.btnPrimary}>+ Créer un groupe</button>
        <button onClick={() => setModal('join')} style={styles.btnSecondary}>Rejoindre avec un code</button>
      </div>

      {/* Groupes */}
      {groups.length === 0 ? (
        <div style={styles.empty}>
          <p>Tu n'as pas encore de groupe.</p>
          <p style={{ color: '#aaa', fontSize: 14 }}>Crée un groupe ou rejoins-en un avec un code d'invitation.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {groups.map((g) => <GroupCard key={g.id} group={g} />)}
        </div>
      )}

      {/* Modals */}
      {modal === 'create' && (
        <CreateGroupModal
          onClose={() => setModal(null)}
          onCreated={() => fetchGroups()}
        />
      )}
      {modal === 'join' && (
        <JoinGroupModal
          onClose={() => setModal(null)}
          onJoined={() => fetchGroups()}
        />
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title: { fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 },
  sub: { fontSize: 15, color: '#666' },
  actions: { display: 'flex', gap: 12, marginBottom: 32 },
  btnPrimary: { padding: '10px 20px', background: '#1A56A0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  btnSecondary: { padding: '10px 20px', background: 'transparent', color: '#1A56A0', border: '1px solid #1A56A0', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  btnLogout: { padding: '8px 16px', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  empty: { textAlign: 'center', padding: '60px 0', color: '#555' },
}