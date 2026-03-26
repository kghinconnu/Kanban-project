import { useNavigate } from 'react-router-dom'

export default function GroupCard({ group }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/groups/${group.id}`)}
      style={{ ...styles.card, borderTop: `4px solid ${group.color}` }}
    >
      <div style={styles.header}>
        <div style={{ ...styles.dot, background: group.color }} />
        <span style={styles.name}>{group.name}</span>
      </div>
      <p style={styles.code}>Code : <strong>{group.invite_code}</strong></p>
      <div style={styles.members}>
        {group.members?.slice(0, 4).map((m) => (
          <div key={m.id} style={{ ...styles.avatar, background: group.color }}>
            {m.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {group.members?.length > 4 && (
          <div style={styles.avatarMore}>+{group.members.length - 4}</div>
        )}
      </div>
      <p style={styles.memberCount}>
        {group.members?.length} membre{group.members?.length > 1 ? 's' : ''}
      </p>
    </div>
  )
}

const styles = {
  card: { background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'box-shadow 0.15s' },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: '50%' },
  name: { fontWeight: 600, fontSize: 15, color: '#1a1a1a' },
  code: { fontSize: 12, color: '#888', marginBottom: 14 },
  members: { display: 'flex', marginBottom: 6 },
  avatar: { width: 28, height: 28, borderRadius: '50%', color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', marginLeft: -4 },
  avatarMore: { width: 28, height: 28, borderRadius: '50%', background: '#eee', color: '#666', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', marginLeft: -4 },
  memberCount: { fontSize: 12, color: '#aaa' },
}