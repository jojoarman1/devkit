import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'

export const getIsAutostartEnabled = () => isEnabled()

export const setIsAutostartEnabled = (isEnabledNext: boolean) => (isEnabledNext ? enable() : disable())
