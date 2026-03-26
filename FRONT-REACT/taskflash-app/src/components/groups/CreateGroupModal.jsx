import { useState } from 'react'
import useGroupStore from '../../store/groupStore'

const COLORS = ['#1A56A0', '#0F6E56', '#854F0B', '#993C1D', '#534AB7', '#5F5E5A']

export default function CreateGroupModal({ onClose, onCreated }) {
  const [name, setName]   = useState('')
  const [color, setColor] = useState('#1A56A0')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const { createGroup } = useGroupStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error: err } = await createGroup(name, color)
    setLoading(false)
    if (err) {
      setError(err)
      return
    }
    onCreated(data)
    onClose()
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Créer un groupe</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Nom du groupe</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Équipe projet..."
            required
            autoFocus
          />
          <label style={styles.label}>Couleur</label>
          <div style={styles.colorRow}>
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                style={{
                  ...styles.colorDot,
                  background: c,
                  outline: color === c ? `3px solid ${c}` : 'none',
                  outlineOffset: 3,
                }}
              />
            ))}
          </div>
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.btnSecondary}>Annuler</button>
            <button type="submit" style={{ ...styles.btnPrimary, background: color }} disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 12, padding: 28, width: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  title: { fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#1a1a1a' },
  label: { display: 'block', fontSize: 13, color: '#666', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  colorRow: { display: 'flex', gap: 10, marginTop: 4 },
  colorDot: { width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', transition: 'outline 0.1s' },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
  btnPrimary: { padding: '9px 20px', borderRadius: 8, border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  btnSecondary: { padding: '9px 20px', borderRadius: 8, border: '1px solid #ddd', background: 'transparent', fontSize: 14, cursor: 'pointer' },
  error: { color: '#c0392b', fontSize: 13, marginBottom: 8 },
}