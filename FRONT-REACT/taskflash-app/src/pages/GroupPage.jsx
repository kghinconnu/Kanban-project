import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGroupStore from '../store/groupStore'
import useTaskStore from '../store/taskStore'
import useGroupChannel from '../hooks/useGroupChannel'
import Board from '../components/board/Board'

export default function GroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentGroup, fetchGroup } = useGroupStore()
  const { projects, fetchProjects, createProject } = useTaskStore()
  const [activeProject, setActiveProject]   = useState(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [projectName, setProjectName]       = useState('')

  // ✅ Tous les hooks AVANT tout return conditionnel
  useEffect(() => {
    fetchGroup(id)
    fetchProjects(id)
  }, [id])

  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0].id)
    }
  }, [projects])

  // ✅ Hook WebSocket ici, pas après le return
  useGroupChannel(id)

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!projectName.trim()) return
    const p = await createProject(id, { name: projectName })
    if (p) {
      setActiveProject(p.id)
      setProjectName('')
      setShowNewProject(false)
    }
  }

  // ✅ Return conditionnel APRÈS tous les hooks
  if (!currentGroup) return <p style={{ padding: 40 }}>Chargement...</p>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.back}>← Retour</button>
        <h1 style={{ ...styles.groupName, color: currentGroup.color }}>{currentGroup.name}</h1>
        <span style={styles.inviteCode}>Code : {currentGroup.invite_code}</span>
      </div>

      <div style={styles.tabs}>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            style={{
              ...styles.tab,
              borderBottom: activeProject === p.id ? `2px solid ${currentGroup.color}` : '2px solid transparent',
              color:      activeProject === p.id ? currentGroup.color : '#888',
              fontWeight: activeProject === p.id ? 600 : 400,
            }}
          >
            {p.icon} {p.name}
          </button>
        ))}

        {showNewProject ? (
          <form onSubmit={handleCreateProject} style={styles.newProjectForm}>
            <input
              style={styles.newProjectInput}
              placeholder="Nom du projet"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              autoFocus
            />
            <button type="submit" style={styles.btnConfirm}>OK</button>
            <button type="button" onClick={() => setShowNewProject(false)} style={styles.btnCancelSmall}>✕</button>
          </form>
        ) : (
          <button onClick={() => setShowNewProject(true)} style={styles.btnAddProject}>+ Projet</button>
        )}
      </div>

      {activeProject ? (
        <Board projectId={activeProject} />
      ) : (
        <div style={styles.empty}>
          <p>Crée ton premier projet pour commencer.</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  page:           { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  header:         { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' },
  back:           { background: 'none', border: 'none', color: '#1A56A0', cursor: 'pointer', fontSize: 14 },
  groupName:      { fontSize: 22, fontWeight: 700, margin: 0 },
  inviteCode:     { fontSize: 12, color: '#aaa', marginLeft: 'auto' },
  tabs:           { display: 'flex', gap: 4, borderBottom: '0.5px solid #eee', marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' },
  tab:            { padding: '10px 16px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', fontSize: 14, transition: 'all 0.15s' },
  btnAddProject:  { padding: '8px 14px', background: 'none', border: '0.5px dashed #ccc', borderRadius: 6, color: '#aaa', cursor: 'pointer', fontSize: 13, marginLeft: 4 },
  newProjectForm: { display: 'flex', gap: 6, alignItems: 'center', padding: '4px 0' },
  newProjectInput:{ padding: '6px 10px', border: '0.5px solid #ccc', borderRadius: 6, fontSize: 13 },
  btnConfirm:     { padding: '6px 12px', background: '#1A56A0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  btnCancelSmall: { padding: '6px 10px', background: 'none', border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#888' },
  empty:          { textAlign: 'center', padding: '80px 0', color: '#bbb' },
}