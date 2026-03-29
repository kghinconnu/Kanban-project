import { useState, useEffect } from 'react'
import { getEcho } from '../lib/echo'
import useTaskStore from '../store/taskStore'

// Store des logs accessible globalement
let logListeners = []
export function subscribeToLogs(fn) {
  logListeners.push(fn)
  return () => { logListeners = logListeners.filter(f => f !== fn) }
}

function addLog(message, color = 'bg-blue-400') {
  const log = {
    message,
    color,
    time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })
  }
  logListeners.forEach(fn => fn(log))
}

export default function useGroupChannel(groupId) {
  useEffect(() => {
    if (!groupId) return

    const echo = getEcho()
    const channel = echo.private(`group.${groupId}`)

    channel
      .subscribed(() => console.log('✅ Abonné au channel group.' + groupId))
      .listen('.TaskCreated', (e) => {
        addLog(`Nouvelle tâche : "${e.task.title}"`, 'bg-emerald-400')
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          const already = (s.tasks[pid] || []).find((t) => t.id === e.task.id)
          if (already) return s
          return { tasks: { ...s.tasks, [pid]: [e.task, ...(s.tasks[pid] || [])] } }
        })
      })
      .listen('.TaskClaimed', (e) => {
        addLog(`${e.task.claimed_by?.name} a pris "${e.task.title}"`, 'bg-blue-400')
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return { tasks: { ...s.tasks, [pid]: (s.tasks[pid] || []).map((t) => t.id === e.task.id ? e.task : t) } }
        })
      })
      .listen('.TaskReleased', (e) => {
        addLog(`Tâche "${e.task.title}" libérée`, 'bg-amber-400')
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return { tasks: { ...s.tasks, [pid]: (s.tasks[pid] || []).map((t) => t.id === e.task.id ? { ...e.task, claimed_by: null } : t) } }
        })
      })
      .listen('.TaskMoved', (e) => {
        const labels = { todo: 'À faire', doing: 'En cours', done: 'Terminé' }
        addLog(`"${e.task.title}" → ${labels[e.task.status]}`, 'bg-purple-400')
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return { tasks: { ...s.tasks, [pid]: (s.tasks[pid] || []).map((t) => t.id === e.task.id ? e.task : t) } }
        })
      })
      .listen('.TaskDeleted', (e) => {
        addLog('Une tâche a été supprimée', 'bg-red-400')
        useTaskStore.setState((s) => {
          const newTasks = {}
          for (const pid in s.tasks) {
            newTasks[pid] = s.tasks[pid].filter((t) => t.id !== e.task_id)
          }
          return { tasks: newTasks }
        })
      })

    return () => { echo.leave(`group.${groupId}`) }
  }, [groupId])
}