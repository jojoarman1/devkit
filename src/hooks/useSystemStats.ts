import { onSystemStats } from '@/api/system.api'
import type { SystemStats } from '@/types/system.types'
import { useEffect, useState } from 'react'

export const useSystemStats = () => {
  const [stats, setStats] = useState<SystemStats | null>(null)

  useEffect(() => {
    const unlistenPromise = onSystemStats(setStats)
    return () => {
      unlistenPromise.then(unlisten => unlisten())
    }
  }, [])

  return stats
}
