import { useEffect } from 'react'
import Column from './Column'
import useTaskStore from '../../store/taskStore'

export default function Board({ projectId }) {
  const { tasks, fetchTasks } = useTaskStore()

  useEffect(() => {
    if (projectId) fetchTasks(projectId)
  }, [projectId])

  const projectTasks = tasks[Number(projectId)] || []

  return (
    <div style={styles.board}>
      {['todo', 'doing', 'done'].map((status) => (
        <Column
          key={status}
          status={status}
          tasks={projectTasks}
          projectId={Number(projectId)}
        />
      ))}
    </div>
  )
}

const styles = {
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    alignItems: 'start',
  },
}