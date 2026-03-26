import { useState } from 'react'
import FlashCard from './FlashCard'
import useTaskStore from '../../store/taskStore'

const COL_CONFIG = {
  todo:  { label: 'À faire',  dot: '#B5D4F4', accent: '#378ADD' },
  doing: { label: 'En cours', dot: '#FAC775', accent: '#BA7517' },
  done:  { label: 'Terminé',  dot: '#C0DD97', accent: '#639922' },
}

export default function Column({ status, tasks, projectId }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [tag, setTag]           = useState('')
  const { createTask }          = useTaskStore()

  const config    = COL_CONFIG[status]
  const colTasks  = tasks.filter((t) => t.status === status)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await createTask(projectId, {
      title,
      description: desc || null,
      tag: tag || null,
      status,
    })
    setTitle('')
    setDesc('')
    setTag('')
    setShowForm(false)
  }

  return (
    <div style={styles.col}>
      <div style={styles.header}>
        <div style={{ ...styles.dot, background: config.dot }} />
        <span style={styles.label}>{config.label}</span>
        <span style={styles.count}>{colTasks.length}</span>
      </div>

      <div style={styles.cards}>
        {colTasks.length === 0 && (
          <p style={styles.empty}>Aucune tâche</p>
        )}
        {colTasks.map((task) => (
          <FlashCard
            key={task.id}
            task={task}
            projectId={projectId}
          />
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleAdd} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Titre *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          <input
            style={styles.input}
            placeholder="Description (optionnel)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <select
            style={styles.input}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="">Sans tag</option>
            <option value="feat">Feature</option>
            <option value="bug">Bug</option>
            <option value="ux">UX</option>
            <option value="infra">Infra</option>
            <option value="data">Data</option>
          </select>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="submit"
              style={{ ...styles.btnAdd, borderColor: config.accent, color: config.accent }}
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitle(''); setDesc(''); setTag('') }}
              style={styles.btnCancel}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} style={styles.btnNew}>
          + Nouvelle tâche
        </button>
      )}
    </div>
  )
}

const styles = {
  col:      { background: '#f7f7f7', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 },
  header:   { display: 'flex', alignItems: 'center', gap: 8 },
  dot:      { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  label:    { fontSize: 13, fontWeight: 600, color: '#1a1a1a', flex: 1 },
  count:    { fontSize: 11, color: '#999', background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 999, padding: '1px 7px' },
  cards:    { display: 'flex', flexDirection: 'column', gap: 8, minHeight: 40 },
  empty:    { fontSize: 12, color: '#ccc', textAlign: 'center', padding: '16px 0' },
  form:     { display: 'flex', flexDirection: 'column', gap: 6 },
  input:    { padding: '7px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 12, width: '100%', boxSizing: 'border-box', outline: 'none' },
  btnAdd:   { flex: 1, padding: '6px', border: '0.5px solid', borderRadius: 6, background: 'transparent', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  btnCancel:{ flex: 1, padding: '6px', border: '0.5px solid #ddd', borderRadius: 6, background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#888' },
  btnNew:   { padding: '8px', border: '0.5px dashed #ccc', borderRadius: 8, background: 'transparent', color: '#aaa', fontSize: 12, cursor: 'pointer', textAlign: 'center' },
}