export default function ActivityLog({ logs }) {
  if (logs.length === 0) return null

  return (
    <div className="mt-6 border-t border-white/5 pt-4">
      <p className="text-xs text-slate-500 font-medium mb-3">Activité récente</p>
      <div className="flex flex-col gap-2">
        {logs.slice(0, 5).map((log, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.color}`} />
            <span>{log.message}</span>
            <span className="ml-auto text-slate-600 flex-shrink-0">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}