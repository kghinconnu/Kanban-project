import { create } from 'zustand'
import api from '../api/axios'
import { resetEcho } from '../lib/echo'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  register: async (name, email, password, passwordConfirmation) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      localStorage.setItem('token', res.data.token)
      set({ user: res.data.user, token: res.data.token, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur inscription', isLoading: false })
      return false
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      set({ user: res.data.user, token: res.data.token, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Identifiants incorrects', isLoading: false })
      return false
    }
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data })
    } catch {
      set({ user: null, token: null })
      localStorage.removeItem('token')
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
      resetEcho()
      set({ user: null, token: null })
    }
  },
}))

export default useAuthStore