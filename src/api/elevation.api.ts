import { invoke } from '@tauri-apps/api/core'

export const getIsElevated = () => invoke<boolean>('check_elevated')

export const relaunchAsAdmin = () => invoke<void>('relaunch_as_admin')
