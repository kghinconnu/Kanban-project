import { useState } from 'react'
import useTaskStore from '../../store/taskStore'

export default function EditTaskModal({ task, projectId, onClose }) {
  const [title, setTitle] = useState(task.title)
  const [desc, setDesc]   = useState(task.description || '')
  const [tag, setTag]     = useState(task.tag || '')
  const [loading, setLoading] = useState(false)
  const { updateTask } = useTaskStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await updateTask(task.id, projectId, { title, description: desc || null, tag: tag || null })
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold">Modifier la tâche</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
              placeholder="Description optionnelle..."
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="">Sans tag</option>
              <option value="feat">Feature</option>
              <option value="bug">Bug</option>
              <option value="ux">UX</option>
              <option value="infra">Infra</option>
              <option value="data">Data</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-white/10 hover:border-white/20 text-slate-300 py-2.5 rounded-xl text-sm transition">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}