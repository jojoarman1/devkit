import { getCurrentWindow } from '@tauri-apps/api/window'

export const minimizeWindow = () => getCurrentWindow().minimize()

export const closeWindow = () => getCurrentWindow().close()

export const getIsAlwaysOnTop = () => getCurrentWindow().isAlwaysOnTop()

export const setIsAlwaysOnTop = (isAlwaysOnTop: boolean) => getCurrentWindow().setAlwaysOnTop(isAlwaysOnTop)

export const onWindowFocusChanged = (handler: (isFocused: boolean) => void) =>
  getCurrentWindow().onFocusChanged(({ payload }) => handler(payload))
