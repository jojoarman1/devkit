import { OPEN_SETTINGS_EVENT } from '@/constants/tray.constants'
import { listen } from '@tauri-apps/api/event'

export const onOpenSettingsRequest = (handler: () => void) => listen(OPEN_SETTINGS_EVENT, handler)
