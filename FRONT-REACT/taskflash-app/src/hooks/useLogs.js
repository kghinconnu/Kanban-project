import { useState, useEffect } from 'react'
import { subscribeToLogs } from './useGroupChannel'

export default function useLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const unsub = subscribeToLogs((log) => {
      setLogs((prev) => [log, ...prev].slice(0, 10))
    })
    return unsub
  }, [])

  return logs
}
