import { invoke } from '@tauri-apps/api/core'

// PNG data URL of the icon Explorer shows for the executable
export const getAppIcon = (path: string) => invoke<string>('get_app_icon', { path })
