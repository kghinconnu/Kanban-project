import useTaskStore from '../../store/taskStore'
import useAuthStore from '../../store/authStore'

const TAG_STYLES = {
  bug:   { background: '#FCEBEB', color: '#A32D2D' },
  feat:  { background: '#E6F1FB', color: '#185FA5' },
  ux:    { background: '#FBEAF0', color: '#993556' },
  infra: { background: '#F1EFE8', color: '#5F5E5A' },
  data:  { background: '#FAEEDA', color: '#854F0B' },
}

const STATUS_NEXT  = { todo: 'doing', doing: 'done',  done: null }
const STATUS_PREV  = { todo: null,    doing: 'todo',  done: 'doing' }
const STATUS_LABEL = { todo: 'À faire', doing: 'En cours', done: 'Terminé' }

export default function FlashCard({ task, projectId }) {
  const { claimTask, releaseTask, moveTask, deleteTask } = useTaskStore()
  const { user } = useAuthStore()

  const isClaimedByMe = task.claimed_by === user?.id
  const isClaimed     = !!task.claimed_by && !isClaimedByMe
  const canMove       = isClaimedByMe || !task.claimed_by
  const claimer       = task.claimed_by_user

  return (
    <div style={{
      ...styles.card,
      opacity:    isClaimed ? 0.6 : 1,
      borderLeft: isClaimedByMe ? '3px solid #378ADD' : '3px solid transparent',
    }}>

      {/* Tag */}
      {task.tag && (
        <span style={{ ...styles.tag, ...TAG_STYLES[task.tag] }}>
          {task.tag}
        </span>
      )}

      {/* Titre */}
      <p style={styles.title}>{task.title}</p>

      {/* Description */}
      {task.description && (
        <p style={styles.desc}>{task.description}</p>
      )}

      {/* Qui a pris la tâche */}
      {task.claimed_by && (
        <div style={styles.claimerRow}>
          <div style={styles.claimerDot} />
          <span style={styles.claimerName}>
            {isClaimedByMe ? 'Pris par moi' : `Pris par ${task.claimed_by?.name ?? '...'}`}
          </span>
        </div>
      )}

      {/* Boutons claim / release */}
      <div style={styles.row}>
        {!task.claimed_by && (
          <button
            style={styles.btnClaim}
            onClick={() => claimTask(task.id, projectId)}
          >
            Prendre
          </button>
        )}
        {isClaimedByMe && (
          <button
            style={styles.btnRelease}
            onClick={() => releaseTask(task.id, projectId)}
          >
            Libérer
          </button>
        )}
      </div>

      {/* Boutons déplacer */}
      {canMove && (STATUS_PREV[task.status] || STATUS_NEXT[task.status]) && (
        <div style={{ ...styles.row, marginTop: 4 }}>
          {STATUS_PREV[task.status] && (
            <button
              style={styles.btnMove}
              onClick={() => moveTask(task.id, projectId, STATUS_PREV[task.status])}
            >
              ← {STATUS_LABEL[STATUS_PREV[task.status]]}
            </button>
          )}
          {STATUS_NEXT[task.status] && (
            <button
              style={styles.btnMove}
              onClick={() => moveTask(task.id, projectId, STATUS_NEXT[task.status])}
            >
              {STATUS_LABEL[STATUS_NEXT[task.status]]} →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  card:        { background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, transition: 'opacity 0.2s' },
  tag:         { display: 'inline-block', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, alignSelf: 'flex-start' },
  title:       { fontSize: 13, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 },
  desc:        { fontSize: 12, color: '#888', lineHeight: 1.5 },
  claimerRow:  { display: 'flex', alignItems: 'center', gap: 6 },
  claimerDot:  { width: 7, height: 7, borderRadius: '50%', background: '#378ADD', flexShrink: 0 },
  claimerName: { fontSize: 11, color: '#378ADD', fontWeight: 500 },
  row:         { display: 'flex', gap: 6, flexWrap: 'wrap' },
  btnClaim:    { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #ccc', background: 'transparent', cursor: 'pointer', color: '#555' },
  btnRelease:  { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #378ADD', background: '#E6F1FB', color: '#185FA5', cursor: 'pointer' },
  btnMove:     { fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '0.5px solid #e0e0e0', background: 'transparent', color: '#666', cursor: 'pointer' },
}