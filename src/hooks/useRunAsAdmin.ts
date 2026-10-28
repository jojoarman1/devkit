import { relaunchAsAdmin } from '@/api/elevation.api'
import { getRunAsAdmin, setRunAsAdmin } from '@/api/settings.api'
import { settingsKeys } from '@/api/settings.keys'
import { useIsElevated } from '@/hooks/useIsElevated'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// "Run as administrator on startup". Turning it on while unelevated relaunches right away,
// except in dev: under `tauri dev` the relaunch would stop the dev server.
export const useRunAsAdmin = () => {
  const queryClient = useQueryClient()
  const isElevated = useIsElevated()
  const { data: isRunAsAdmin = false } = useQuery({
    queryKey: settingsKeys.runAsAdmin(),
    queryFn: getRunAsAdmin,
    staleTime: Infinity,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: setRunAsAdmin,
    onSuccess: (_, isEnabled) => {
      queryClient.setQueryData(settingsKeys.runAsAdmin(), isEnabled)
      if (isEnabled && isElevated === false && import.meta.env.PROD) relaunchAsAdmin()
    },
  })

  return { isRunAsAdmin, isPending, toggleRunAsAdmin: () => mutate(!isRunAsAdmin) }
}
