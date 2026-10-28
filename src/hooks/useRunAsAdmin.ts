import { relaunchAsAdmin } from '@/api/elevation.api'
import { useIsElevated } from '@/hooks/useIsElevated'
import { useSettings } from '@/hooks/useSettings'

// Turning it on while unelevated relaunches right away, except in dev:
// under `tauri dev` the relaunch would open the debug exe's console and lose the dev server
export const useRunAsAdmin = () => {
  const isElevated = useIsElevated()
  const { settings, isPending, updateSettingsAsync } = useSettings()

  const toggleRunAsAdmin = async () => {
    const isEnabled = !settings.runAsAdmin
    await updateSettingsAsync({ runAsAdmin: isEnabled })
    if (isEnabled && isElevated === false && import.meta.env.PROD) relaunchAsAdmin()
  }

  return { isRunAsAdmin: settings.runAsAdmin, isPending, toggleRunAsAdmin }
}
