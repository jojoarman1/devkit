import { getAppIcon } from '@/api/icon.api'
import { iconKeys } from '@/api/icon.keys'
import { skipToken, useQuery } from '@tanstack/react-query'

// An executable's icon never changes while the app runs, so it is fetched once and kept for good
export const useAppIcon = (path: string | null) =>
  useQuery({
    queryKey: iconKeys.app(path),
    queryFn: path ? () => getAppIcon(path) : skipToken,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })
