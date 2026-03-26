import { useState } from 'react'
import useGroupStore from '../../store/groupStore'

export default function JoinGroupModal({ onClose, onJoined }) {
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const { joinGroup } = useGroupStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error: err } = await joinGroup(code.trim().toUpperCase())
    setLoading(false)
    if (err) {
      setError(err)
      return
    }
    onJoined(data)
    onClose()
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Rejoindre un groupe</h2>
        <p style={styles.sub}>Demande le code d'invitation à l'admin du groupe.</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.codeInput}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex : AB12CD34"
            maxLength={8}
            required
            autoFocus
          />
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.btnSecondary}>Annuler</button>
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Recherche...' : 'Rejoindre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 12, padding: 28, width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  title: { fontSize: 18, fontWeight: 600, marginBottom: 6, color: '#1a1a1a' },
  sub: { fontSize: 13, color: '#888', marginBottom: 18 },
  codeInput: { width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: 8, fontSize: 22, textAlign: 'center', letterSpacing: 6, fontWeight: 700, boxSizing: 'border-box', textTransform: 'uppercase' },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 },
  btnPrimary: { padding: '9px 20px', borderRadius: 8, border: 'none', background: '#1A56A0', color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  btnSecondary: { padding: '9px 20px', borderRadius: 8, border: '1px solid #ddd', background: 'transparent', fontSize: 14, cursor: 'pointer' },
  error: { color: '#c0392b', fontSize: 13, marginBottom: 10 },
}