import { invoke } from '@tauri-apps/api/core'

export const getRunAsAdmin = () => invoke<boolean>('get_run_as_admin')

export const setRunAsAdmin = (isEnabled: boolean) => invoke<void>('set_run_as_admin', { isEnabled })
