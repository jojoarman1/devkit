import { checkForUpdate, getAppVersion, installUpdate } from '@/api/updates.api'
import { updatesKeys } from '@/api/updates.keys'
import { UPDATE_LABELS } from '@/constants/updates.constants'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useUpdater = () => {
  const { data: version } = useQuery({
    queryKey: updatesKeys.version(),
    queryFn: getAppVersion,
    staleTime: Infinity,
  })
  const checkMutation = useMutation({ mutationFn: checkForUpdate })
  const installMutation = useMutation({ mutationFn: installUpdate })

  const update = checkMutation.data
  const isBusy = checkMutation.isPending || installMutation.isPending

  const getLabel = () => {
    if (installMutation.isPending) return UPDATE_LABELS.installing
    if (checkMutation.isPending) return UPDATE_LABELS.checking
    if (checkMutation.isError || installMutation.isError) return UPDATE_LABELS.failed
    if (update) return `Update to ${update.version}`
    if (checkMutation.isSuccess) return UPDATE_LABELS.upToDate
    return UPDATE_LABELS.check
  }

  return {
    version,
    label: getLabel(),
    isBusy,
    isUpdateAvailable: !!update,
    run: () => (update ? installMutation.mutate(update) : checkMutation.mutate()),
  }
}
