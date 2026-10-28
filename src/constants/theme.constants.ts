import type { Theme } from '@/types/theme.types'

export const THEMES = ['system', 'light', 'dark'] as const

export const THEME_LABELS: Record<Theme, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}

// mirror of the saved theme, read synchronously at startup so the first paint already has it
export const THEME_STORAGE_KEY = 'devkit:theme'
