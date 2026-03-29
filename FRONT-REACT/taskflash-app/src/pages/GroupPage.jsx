import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGroupStore from '../store/groupStore'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'
import useGroupChannel from '../hooks/useGroupChannel'
import Board from '../components/board/Board'
import toast from 'react-hot-toast'
import usePresence from '../hooks/usePresence'
import ActivityLog from '../components/board/ActivityLog'
import useLogs from '../hooks/useLogs'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function GroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentGroup, fetchGroup } = useGroupStore()
  const { projects, fetchProjects, createProject } = useTaskStore()
  const { fetchMe } = useAuthStore()
  const [activeProject, setActiveProject]   = useState(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [projectName, setProjectName]       = useState('')
  const onlineUsers = usePresence(id)
  const logs = useLogs()

  useEffect(() => { fetchMe(); fetchGroup(id); fetchProjects(id) }, [id])

  useEffect(() => {
    if (projects.length > 0 && !activeProject) setActiveProject(projects[0].id)
  }, [projects])

  useGroupChannel(id)

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!projectName.trim()) return
    const p = await createProject(id, { name: projectName })
    if (p) { setActiveProject(p.id); setProjectName(''); setShowNewProject(false) }
  }

  if (!currentGroup) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)', color: 'var(--t1)' }}>
      <nav className="border-b backdrop-blur sticky top-0 z-10 transition-colors duration-300"
        style={{ background: 'var(--nav)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-3 flex-wrap">
          <button onClick={() => navigate('/dashboard')}
            className="text-sm px-3 py-1.5 rounded-lg transition"
            style={{ color: 'var(--t2)' }}>
            ← Retour
          </button>
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: currentGroup.color }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--t1)' }}>{currentGroup.name}</span>
          </div>

          {/* Présence */}
          {onlineUsers.length > 0 && (
            <div className="flex items-center gap-1">
              {onlineUsers.slice(0, 5).map((u) => (
                <div key={u.id} title={`${u.name} (en ligne)`}
                  className="w-7 h-7 rounded-full bg-emerald-600 border-2 flex items-center justify-center text-xs font-semibold text-white -ml-1 first:ml-0"
                  style={{ borderColor: 'var(--bg)' }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
              ))}
              <span className="text-xs text-emerald-400 ml-1">{onlineUsers.length} en ligne</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs font-mono px-2 py-1 rounded-lg"
              style={{ background: 'var(--input)', color: 'var(--t3)' }}>
              {currentGroup.invite_code}
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(currentGroup.invite_code); toast.success('Code copié !') }}
              className="text-xs px-2 py-1 rounded-lg transition"
              style={{ background: 'var(--input)', color: 'var(--t2)' }}>
              Copier
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Onglets */}
        <div className="flex items-center gap-1 border-b mb-6 overflow-x-auto pb-px"
          style={{ borderColor: 'var(--border)' }}>
          {projects.map((p) => (
            <button key={p.id} onClick={() => setActiveProject(p.id)}
              className="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all"
              style={{
                borderBottomColor: activeProject === p.id ? '#3B82F6' : 'transparent',
                color: activeProject === p.id ? '#3B82F6' : 'var(--t2)',
              }}>
              {p.icon} {p.name}
            </button>
          ))}

          {showNewProject ? (
            <form onSubmit={handleCreateProject} className="flex items-center gap-2 ml-2">
              <input
                className="rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                style={{ background: 'var(--input)', border: '1px solid var(--input-border)', color: 'var(--t1)' }}
                placeholder="Nom du projet"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition">OK</button>
              <button type="button" onClick={() => setShowNewProject(false)}
                className="text-xs px-2 py-1.5 transition" style={{ color: 'var(--t2)' }}>✕</button>
            </form>
          ) : (
            <button onClick={() => setShowNewProject(true)}
              className="ml-2 text-xs border border-dashed px-3 py-1.5 rounded-lg transition whitespace-nowrap"
              style={{ borderColor: 'var(--border)', color: 'var(--t3)' }}>
              + Projet
            </button>
          )}
        </div>

        {activeProject ? (
          <Board projectId={activeProject} />
        ) : (
          <div className="text-center py-24 border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            <p style={{ color: 'var(--t2)' }}>Crée ton premier projet pour commencer.</p>
          </div>
        )}
        {activeProject && <ActivityLog logs={logs} />}
      </div>
    </div>
  )
}