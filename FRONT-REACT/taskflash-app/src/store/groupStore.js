import { create } from 'zustand'
import api from '../api/axios'

const useGroupStore = create((set) => ({
  groups: [],
  currentGroup: null,
  isLoading: false,

  fetchGroups: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/groups')
      set({ groups: res.data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  createGroup: async (name, color) => {
    try {
      const res = await api.post('/groups', { name, color })
      set((state) => ({
        groups: [...state.groups, res.data],
      }))
      return { data: res.data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || 'Erreur création' }
    }
  },

  joinGroup: async (invite_code) => {
    try {
      const res = await api.post('/groups/join', { invite_code })
      set((state) => ({
        groups: [...state.groups, res.data],
      }))
      return { data: res.data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || 'Code invalide' }
    }
  },

  fetchGroup: async (id) => {
    set({ isLoading: true })
    try {
      const res = await api.get(`/groups/${id}`)
      set({ currentGroup: res.data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  leaveGroup: async (id) => {
    try {
      await api.delete(`/groups/${id}/leave`)
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
        currentGroup: null,
      }))
      return { error: null }
    } catch (err) {
      return { error: err.response?.data?.message || 'Erreur' }
    }
  },
}))

export default useGroupStore