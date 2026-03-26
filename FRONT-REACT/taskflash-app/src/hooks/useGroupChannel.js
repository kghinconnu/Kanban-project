import { useEffect } from 'react'
import { getEcho } from '../lib/echo'
import useTaskStore from '../store/taskStore'

export default function useGroupChannel(groupId) {
  useEffect(() => {
    if (!groupId) return

    console.log('🔌 Connexion au channel group.' + groupId)
    const echo = getEcho()
    const channel = echo.private(`group.${groupId}`)

    channel
      .subscribed(() => {
        console.log('✅ Abonné au channel group.' + groupId)
      })
      .error((err) => {
        console.log('❌ Erreur channel:', err)
      })
      .listen('.TaskCreated', (e) => {
        console.log('📦 TaskCreated reçu:', e)
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          const already = (s.tasks[pid] || []).find((t) => t.id === e.task.id)
          if (already) return s
          return {
            tasks: {
              ...s.tasks,
              [pid]: [e.task, ...(s.tasks[pid] || [])],
            },
          }
        })
      })
      .listen('.TaskClaimed', (e) => {
        console.log('📦 TaskClaimed reçu:', e)
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return {
            tasks: {
              ...s.tasks,
              [pid]: (s.tasks[pid] || []).map((t) =>
                t.id === e.task.id ? e.task : t
              ),
            },
          }
        })
      })
      .listen('.TaskReleased', (e) => {
        console.log('📦 TaskReleased reçu:', e)
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return {
            tasks: {
              ...s.tasks,
              [pid]: (s.tasks[pid] || []).map((t) =>
                t.id === e.task.id ? e.task : t
              ),
            },
          }
        })
      })
      .listen('.TaskMoved', (e) => {
        console.log('📦 TaskMoved reçu:', e)
        useTaskStore.setState((s) => {
          const pid = Number(e.task.project_id)
          return {
            tasks: {
              ...s.tasks,
              [pid]: (s.tasks[pid] || []).map((t) =>
                t.id === e.task.id ? e.task : t
              ),
            },
          }
        })
      })
      .listen('.TaskDeleted', (e) => {
        console.log('📦 TaskDeleted reçu:', e)
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