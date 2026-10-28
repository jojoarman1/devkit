import { SYSTEM_STATS_EVENT } from '@/constants/system.constants'
import type { SystemStats } from '@/types/system.types'
import { listen } from '@tauri-apps/api/event'

export const onSystemStats = (handler: (stats: SystemStats) => void) =>
  listen<SystemStats>(SYSTEM_STATS_EVENT, event => handler(event.payload))
