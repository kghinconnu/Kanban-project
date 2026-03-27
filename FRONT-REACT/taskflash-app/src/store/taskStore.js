import { create } from 'zustand'
import api from '../api/axios'

const useTaskStore = create((set, get) => ({
  projects: [],
  tasks: {},      // { [project_id]: [...tasks] }
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

  createTask: async (projectId, data) => {
    const res = await api.post(`/projects/${projectId}/tasks`, data)
    set((s) => ({
      tasks: {
        ...s.tasks,
        [Number(projectId)]: [res.data, ...(s.tasks[Number(projectId)] || [])],
      },
    }))
    return res.data
  },

  claimTask: async (taskId, projectId) => {
    const task = get().tasks[projectId]?.find(t => t.id === taskId);
    if (task?.claimed_by) return;
    const res = await api.patch(`/tasks/${taskId}/claim`)
    set((s) => ({
      tasks: {
        ...s.tasks,
        [Number(projectId)]: s.tasks[Number(projectId)].map((t) =>
          t.id === taskId ? res.data : t
        ),
      },
    }))
  },

  releaseTask: async (taskId, projectId) => {
    const res = await api.patch(`/tasks/${taskId}/release`)
    set((s) => ({
      tasks: {
        ...s.tasks,
        [Number(projectId)]: s.tasks[Number(projectId)].map((t) =>
          t.id === taskId ? res.data : t
        ),
      },
    }))
  },

  moveTask: async (taskId, projectId, status) => {
    const res = await api.patch(`/tasks/${taskId}/move`, { status })
    set((s) => ({
      tasks: {
        ...s.tasks,
        [Number(projectId)]: s.tasks[Number(projectId)].map((t) =>
          t.id === taskId ? res.data : t
        ),
      },
    }))
  },

  deleteTask: async (taskId, projectId) => {
    await api.delete(`/tasks/${taskId}`)
    set((s) => ({
      tasks: {
        ...s.tasks,
        [Number(projectId)]: s.tasks[Number(projectId)].filter((t) => t.id !== taskId),
      },
    }))
  },
}))

export default useTaskStore