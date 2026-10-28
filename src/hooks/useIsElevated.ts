import { getIsElevated } from '@/api/elevation.api'
import { elevationKeys } from '@/api/elevation.keys'
import { useQuery } from '@tanstack/react-query'

// A process can't gain or lose elevation while it runs, so this is read once
export const useIsElevated = () =>
  useQuery({
    queryKey: elevationKeys.isElevated(),
    queryFn: getIsElevated,
    staleTime: Infinity,
  }).data
