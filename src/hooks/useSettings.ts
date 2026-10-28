import { getSettings, setSettings } from '@/api/settings.api'
import { settingsKeys } from '@/api/settings.keys'
import { DEFAULT_SETTINGS } from '@/constants/settings.constants'
import type { Settings } from '@/types/settings.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useSettings = () => {
  const queryClient = useQueryClient()
  const { data: settings = DEFAULT_SETTINGS, isSuccess: isLoaded } = useQuery({
    queryKey: settingsKeys.all,
    queryFn: getSettings,
    staleTime: Infinity,
  })

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: setSettings,
    onSuccess: (_, saved) => queryClient.setQueryData(settingsKeys.all, saved),
  })

  const updateSettings = (patch: Partial<Settings>) => mutate({ ...settings, ...patch })
  const updateSettingsAsync = (patch: Partial<Settings>) => mutateAsync({ ...settings, ...patch })

  return { settings, isLoaded, isPending, updateSettings, updateSettingsAsync }
}
