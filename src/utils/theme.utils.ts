import { THEME_STORAGE_KEY, THEMES } from '@/constants/theme.constants'
import type { Theme } from '@/types/theme.types'

const isTheme = (value: string | null): value is Theme => (THEMES as readonly (string | null)[]).includes(value)

export const readStoredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return isTheme(stored) ? stored : 'system'
}

// 'system' removes the attribute so index.css falls back to the OS preference
export const applyTheme = (theme: Theme) => {
  if (theme === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}
