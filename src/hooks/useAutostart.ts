import { getIsAutostartEnabled, setIsAutostartEnabled } from '@/api/autostart.api'
import { autostartKeys } from '@/api/autostart.keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// The state lives in the Windows Run registry key, not in settings.json, so it is read from the plugin.
// Disabled in dev: the entry would point at the debug exe, which has no frontend without the dev server.
export const useAutostart = () => {
  const queryClient = useQueryClient()
  const { data: isAutostartEnabled = false } = useQuery({
    queryKey: autostartKeys.all,
    queryFn: getIsAutostartEnabled,
    staleTime: Infinity,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: setIsAutostartEnabled,
    onSuccess: (_, isEnabled) => queryClient.setQueryData(autostartKeys.all, isEnabled),
  })

  return {
    isAutostartEnabled,
    isAutostartAvailable: import.meta.env.PROD,
    isPending,
    toggleAutostart: () => mutate(!isAutostartEnabled),
  }
}
