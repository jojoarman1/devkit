import { setWindowTheme } from '@/api/window.api'
import { useSettings } from '@/hooks/useSettings'
import { applyTheme } from '@/utils/theme.utils'
import { useEffect } from 'react'

export const useThemeSync = () => {
  const { settings, isLoaded } = useSettings()

  useEffect(() => {
    // until Rust answers, `settings.theme` is the default and would undo the theme applied at startup
    if (!isLoaded) return
    applyTheme(settings.theme)
    setWindowTheme(settings.theme === 'system' ? null : settings.theme)
  }, [isLoaded, settings.theme])
}
