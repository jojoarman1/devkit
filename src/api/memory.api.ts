import { invoke } from '@tauri-apps/api/core'

// resolves with the bytes that became available; rejects with MemoryCleanError
export const cleanMemory = () => invoke<number>('clean_memory')
