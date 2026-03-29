import { create } from 'zustand'
import api from '../api/axios'

const useTaskStore = create((set, get) => ({
  projects: [],
  tasks: {},
  isLoading: false,
  error: null,

  fetchProjects: async (groupId) => {
    const res = await api.get(`/groups/${groupId}/projects`)
    set({ projects: res.data })
  },

  createProject: async (groupId, data) => {
    const res = await api.post(`/groups/${groupId}/projects`, data)
    set((s) => ({ projects: [...s.projects, res.data] }))
    return res.data
  },

  fetchTasks: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/tasks`)
    set((s) => ({ tasks: { ...s.tasks, [Number(projectId)]: res.data } }))
  },

  // Reverb gère l'ajout pour tout le monde via TaskCreated
  createTask: async (projectId, data) => {
    const res = await api.post(`/projects/${projectId}/tasks`, data)
    return res.data
  },

  // Reverb gère via TaskClaimed
  claimTask: async (taskId, projectId) => {
    const task = get().tasks[Number(projectId)]?.find(t => t.id === taskId)
    if (task?.claimed_by) return
    await api.patch(`/tasks/${taskId}/claim`)
  },

  // Reverb gère via TaskReleased
  releaseTask: async (taskId, projectId) => {
    await api.patch(`/tasks/${taskId}/release`)
  },

  // Reverb gère via TaskMoved
  moveTask: async (taskId, projectId, status) => {
    await api.patch(`/tasks/${taskId}/move`, { status })
  },

  // Reverb gère via TaskDeleted
  deleteTask: async (taskId, projectId) => {
    await api.delete(`/tasks/${taskId}`)
  },
  updateTask: async (taskId, projectId, data) => {
  const res = await api.patch(`/tasks/${taskId}`, data)
  set((s) => ({
    tasks: {
      ...s.tasks,
      [Number(projectId)]: s.tasks[Number(projectId)].map((t) =>
        t.id === taskId ? res.data : t
      ),
    },
  }))
  return res.data
},
}))

export default useTaskStore