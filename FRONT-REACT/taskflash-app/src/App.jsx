import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // 1. Importation
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import GroupPage from './pages/GroupPage'  
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'


export default function App() {
  return (
    <BrowserRouter>
      {/* 2. Le Toaster est placé ici pour être au-dessus de tout */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />
      
     <Routes>
  <Route path="/login"     element={<Login />} />
  <Route path="/register"  element={<Register />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/groups/:id" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
  <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="*"          element={<Navigate to="/login" replace />} />
</Routes>
    </BrowserRouter>
  )
}