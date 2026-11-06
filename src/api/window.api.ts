import type { Theme } from '@/types/theme.types'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const minimizeWindow = () => getCurrentWindow().minimize()

export const closeWindow = () => getCurrentWindow().close()

export const getIsAlwaysOnTop = () => getCurrentWindow().isAlwaysOnTop()

export const setIsAlwaysOnTop = (isAlwaysOnTop: boolean) => getCurrentWindow().setAlwaysOnTop(isAlwaysOnTop)

export const onWindowFocusChanged = (handler: (isFocused: boolean) => void) =>
  getCurrentWindow().onFocusChanged(({ payload }) => handler(payload))

// goes through Rust so the webview also drops to its low-memory level while in the tray
export const hideWindow = () => invoke('hide_to_tray')

// null follows the OS; this themes the native frame (border, shadow), the page itself uses data-theme
export const setWindowTheme = (theme: Exclude<Theme, 'system'> | null) => getCurrentWindow().setTheme(theme)
