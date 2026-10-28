import { getIsAlwaysOnTop, setIsAlwaysOnTop } from '@/api/window.api'
import { windowKeys } from '@/api/window.keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// The pin state lives in the window, not in React: a webview reload keeps the window pinned,
// so it is read back from Tauri instead of starting from a local `false`.
export const useAlwaysOnTop = () => {
  const queryClient = useQueryClient()
  const { data: isAlwaysOnTop = false } = useQuery({
    queryKey: windowKeys.alwaysOnTop(),
    queryFn: getIsAlwaysOnTop,
    staleTime: Infinity,
  })

  const { mutate } = useMutation({
    mutationFn: setIsAlwaysOnTop,
    onSuccess: (_, isPinned) => queryClient.setQueryData(windowKeys.alwaysOnTop(), isPinned),
  })

  return { isAlwaysOnTop, toggleAlwaysOnTop: () => mutate(!isAlwaysOnTop) }
}
