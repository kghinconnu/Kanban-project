import { useState } from 'react'
import FlashCard from './FlashCard'
import useTaskStore from '../../store/taskStore'

const COL_CONFIG = {
  todo:  { label: 'À faire',  dot: 'bg-blue-400',  accent: 'border-blue-500/50 focus:ring-blue-500', btn: 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10' },
  doing: { label: 'En cours', dot: 'bg-amber-400', accent: 'border-amber-500/50 focus:ring-amber-500', btn: 'text-amber-400 border-amber-500/30 hover:bg-amber-500/10' },
  done:  { label: 'Terminé',  dot: 'bg-green-400', accent: 'border-green-500/50 focus:ring-green-500', btn: 'text-green-400 border-green-500/30 hover:bg-green-500/10' },
}

export default function Column({ status, tasks, projectId }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [tag, setTag]           = useState('')
  const { createTask }          = useTaskStore()
  const config   = COL_CONFIG[status]
  const colTasks = tasks.filter((t) => t.status === status)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await createTask(projectId, { title, description: desc || null, tag: tag || null, status })
    setTitle(''); setDesc(''); setTag(''); setShowForm(false)
  }

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 min-h-64">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className="text-sm font-semibold text-slate-200 flex-1">{config.label}</span>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{colTasks.length}</span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1 group">
        {colTasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-8 border border-dashed border-white/5 rounded-xl">
            <p className="text-xs text-slate-600">Aucune tâche</p>
          </div>
        )}
        {colTasks.map((task) => (
          <FlashCard key={task.id} task={task} projectId={projectId} />
        ))}
      </div>

      {/* Formulaire */}
      {showForm ? (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mt-1">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="Titre *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="Description (optionnel)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <select
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500 transition"
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
          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 text-xs py-2 rounded-lg border font-medium transition ${config.btn}`}
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitle(''); setDesc(''); setTag('') }}
              className="flex-1 text-xs py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full text-xs py-2.5 border border-dashed border-white/10 hover:border-white/20 text-slate-500 hover:text-slate-300 rounded-xl transition"
        >
          + Nouvelle tâche
        </button>
      )}
    </div>
  )
}