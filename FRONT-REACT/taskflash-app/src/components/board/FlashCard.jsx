import { useState } from 'react'
import useTaskStore from '../../store/taskStore'
import useAuthStore from '../../store/authStore'
import ConfirmModal from '../ui/ConfirmModal'
import EditTaskModal from './EditTaskModal'

const TAG_STYLES = {
  bug:   'bg-red-500/10 text-red-400 border border-red-500/20',
  feat:  'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  ux:    'bg-pink-500/10 text-pink-400 border border-pink-500/20',
  infra: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  data:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
}

const STATUS_NEXT  = { todo: 'doing', doing: 'done', done: null }
const STATUS_PREV  = { todo: null, doing: 'todo', done: 'doing' }
const STATUS_LABEL = { todo: 'À faire', doing: 'En cours', done: 'Terminé' }

export default function FlashCard({ task, projectId }) {
  const { claimTask, releaseTask, moveTask, deleteTask } = useTaskStore()
  const { user } = useAuthStore()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEdit, setShowEdit]       = useState(false)

  const claimerId     = task.claimed_by?.id ?? null
  const isClaimedByMe = claimerId !== null && Number(claimerId) === Number(user?.id)
  const isClaimed     = claimerId !== null && !isClaimedByMe
  const canMove       = isClaimedByMe || !claimerId

  return (
    <>
      <div className={`
        bg-slate-800/50 border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 group
        ${isClaimed ? 'opacity-50' : 'hover:bg-slate-800'}
        ${isClaimedByMe ? 'border-blue-500/50' : 'border-white/5'}
      `}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {task.tag && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_STYLES[task.tag]}`}>
                {task.tag}
              </span>
            )}
            {isClaimedByMe && (
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                En cours par moi
              </span>
            )}
            {isClaimed && (
              <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                Pris par {task.claimed_by?.name ?? '...'}
              </span>
            )}
          </div>
          {/* Actions rapides */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => setShowEdit(true)}
              className="text-slate-500 hover:text-blue-400 transition p-1 rounded"
              title="Modifier"
            >
              ✏️
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="text-slate-500 hover:text-red-400 transition p-1 rounded"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Titre */}
        <p className="text-sm font-semibold text-white leading-snug">{task.title}</p>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex gap-2">
            {!claimerId && (
              <button
                onClick={() => claimTask(task.id, projectId)}
                className="flex-1 text-xs py-1.5 px-3 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 text-slate-400 transition"
              >
                Prendre
              </button>
            )}
            {isClaimedByMe && (
              <button
                onClick={() => releaseTask(task.id, projectId)}
                className="flex-1 text-xs py-1.5 px-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition"
              >
                Libérer la tâche
              </button>
            )}
          </div>

          {canMove && (STATUS_PREV[task.status] || STATUS_NEXT[task.status]) && (
            <div className="flex gap-2">
              {STATUS_PREV[task.status] && (
                <button
                  onClick={() => moveTask(task.id, projectId, STATUS_PREV[task.status])}
                  className="flex-1 text-xs py-1.5 px-2 rounded-lg border border-white/5 hover:border-white/10 text-slate-500 hover:text-slate-300 transition"
                >
                  ← {STATUS_LABEL[STATUS_PREV[task.status]]}
                </button>
              )}
              {STATUS_NEXT[task.status] && (
                <button
                  onClick={() => moveTask(task.id, projectId, STATUS_NEXT[task.status])}
                  className="flex-1 text-xs py-1.5 px-2 rounded-lg border border-white/5 hover:border-white/10 text-slate-500 hover:text-slate-300 transition"
                >
                  {STATUS_LABEL[STATUS_NEXT[task.status]]} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmation suppression */}
      {showConfirm && (
        <ConfirmModal
          message={`Supprimer "${task.title}" ? Cette action est irréversible.`}
          onConfirm={() => { deleteTask(task.id, projectId); setShowConfirm(false) }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Modal édition — ajouté juste après */}
      {showEdit && (
        <EditTaskModal
          task={task}
          projectId={projectId}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}