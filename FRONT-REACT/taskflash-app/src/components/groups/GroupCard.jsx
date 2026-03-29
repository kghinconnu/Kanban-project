import { useNavigate } from 'react-router-dom'

export default function GroupCard({ group }) {
  const navigate = useNavigate()
  const total = group.tasks_count ?? 0
  const done  = group.done_tasks_count ?? 0
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div
      onClick={() => navigate(`/groups/${group.id}`)}
      className="bg-slate-900 border border-white/5 hover:border-white/15 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg"
          style={{ background: group.color }}
        >
          {group.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate group-hover:text-blue-300 transition">
            {group.name}
          </h3>
          <p className="text-slate-500 text-xs">
            {group.members?.length} membre{group.members?.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 mb-3">
        <div className="flex -space-x-2">
          {group.members?.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-semibold text-white"
              style={{ background: group.color }}
              title={m.name}
            >
              {m.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {group.members?.length > 4 && (
            <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-slate-300">
              +{group.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded-lg">
          {group.invite_code}
        </span>
      </div>
    </div>
  )
}