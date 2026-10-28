import type { Theme } from '@/types/theme.types'

// Mirrors Settings in src-tauri/src/settings.rs
export interface Settings {
  runAsAdmin: boolean
  minimizeToTray: boolean
  theme: Theme
}
