import { onSystemStats } from '@/api/system.api'
import { HISTORY_GAP_MS, HISTORY_LENGTH } from '@/constants/metric-chart.constants'
import type { SystemStats } from '@/types/system.types'
import { useEffect, useRef, useState } from 'react'

export const useSystemStats = () => {
  const [history, setHistory] = useState<SystemStats[]>([])
  const lastReceivedAtRef = useRef(0)

  useEffect(() => {
    const unlistenPromise = onSystemStats(stats => {
      const receivedAt = Date.now()
      const isContiguous = receivedAt - lastReceivedAtRef.current < HISTORY_GAP_MS
      lastReceivedAtRef.current = receivedAt
      setHistory(previous => [...(isContiguous ? previous.slice(1 - HISTORY_LENGTH) : []), stats])
    })
    return () => {
      unlistenPromise.then(unlisten => unlisten())
    }
  }, [])

  return { stats: history[history.length - 1] ?? null, history }
}
