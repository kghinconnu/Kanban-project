import { create } from 'zustand'

const useThemeStore = create((set) => ({
  dark: localStorage.getItem('theme') !== 'light',

  toggleTheme: () => set((s) => {
    const newDark = !s.dark
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    if (newDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    return { dark: newDark }
  }),

  init: () => {
    const dark = localStorage.getItem('theme') !== 'light'
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.add('light')
    }
  },
}))

export default useThemeStore