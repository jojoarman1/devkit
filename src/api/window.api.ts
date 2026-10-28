import type { Theme } from '@/types/theme.types'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const minimizeWindow = () => getCurrentWindow().minimize()

export const closeWindow = () => getCurrentWindow().close()

export const getIsAlwaysOnTop = () => getCurrentWindow().isAlwaysOnTop()

export const setIsAlwaysOnTop = (isAlwaysOnTop: boolean) => getCurrentWindow().setAlwaysOnTop(isAlwaysOnTop)

export const onWindowFocusChanged = (handler: (isFocused: boolean) => void) =>
  getCurrentWindow().onFocusChanged(({ payload }) => handler(payload))

export const hideWindow = () => getCurrentWindow().hide()

// null follows the OS; this themes the native frame (border, shadow), the page itself uses data-theme
export const setWindowTheme = (theme: Exclude<Theme, 'system'> | null) => getCurrentWindow().setTheme(theme)
