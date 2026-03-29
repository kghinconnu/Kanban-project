import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import useAuthStore from './store/authStore.js'
import useThemeStore from './store/ThemeStore.js'

const token = localStorage.getItem('token')
if (token) {
  useAuthStore.getState().fetchMe()
}

useThemeStore.getState().init()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)