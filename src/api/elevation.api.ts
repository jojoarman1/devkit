import { invoke } from '@tauri-apps/api/core'

export const getIsElevated = () => invoke<boolean>('check_elevated')

// shows the UAC prompt, starts an elevated instance and closes this one
export const relaunchAsAdmin = () => invoke<void>('relaunch_as_admin')
