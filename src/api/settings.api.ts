import type { Settings } from '@/types/settings.types'
import { invoke } from '@tauri-apps/api/core'

export const getSettings = () => invoke<Settings>('get_settings')

export const setSettings = (settings: Settings) => invoke<void>('set_settings', { settings })
