import { useEffect } from 'react'
import { getEcho } from '../lib/echo'
import useTaskStore from '../store/taskStore'
import toast from 'react-hot-toast' // Importation du toast

export default function useGroupChannel(groupId) {
  useEffect(() => {
    if (!groupId) return

    const echo = getEcho()
    const channel = echo.private(`group.${groupId}`)

    channel
      .subscribed(() => {
        console.log('✅ Abonné au channel group.' + groupId)
      })
      .listen('.TaskCreated', (e) => {
        toast.success(`Nouvelle tâche ajoutée : ${e.task.title}`) // Notification
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          const already = (s.tasks[pid] || []).find((t) => t.id === e.task.id)
          if (already) return s
          return {
            tasks: { ...s.tasks, [pid]: [e.task, ...(s.tasks[pid] || [])] },
          }
        })
      })
      .listen('.TaskClaimed', (e) => {
        toast(`${e.task.claimed_by_name || 'Quelqu\'un'} a pris une tâche`, { icon: '🤝' })
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return {
            tasks: {
              ...s.tasks,
              [pid]: (s.tasks[pid] || []).map((t) => t.id === e.task.id ? e.task : t),
            },
          }
        })
      })
      .listen('.TaskReleased', (e) => {
        toast.secondary(`Tâche libérée : ${e.task.title}`)
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return {
            tasks: {
              ...s.tasks,
              [pid]: (s.tasks[pid] || []).map((t) => t.id === e.task.id ? e.task : t),
            },
          }
        })
      })
      .listen('.TaskMoved', (e) => {
        toast(`Tâche déplacée vers ${e.task.status}`, { icon: '🔄' })
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return {
            tasks: {
              ...s.tasks,
              [pid]: (s.tasks[pid] || []).map((t) => t.id === e.task.id ? e.task : t),
            },
          }
        })
      })
      .listen('.TaskDeleted', (e) => {
        toast.error("Une tâche a été supprimée")
        useTaskStore.setState((s) => {
          const newTasks = {}
          for (const pid in s.tasks) {
            newTasks[pid] = s.tasks[pid].filter((t) => t.id !== e.task_id)
          }
          return { tasks: newTasks }
        })
      })

    return () => {
      echo.leave(`group.${groupId}`)
    }
  }, [groupId])
}