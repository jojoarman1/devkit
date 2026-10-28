import { relaunchAsAdmin } from '@/api/elevation.api'
import { cleanMemory } from '@/api/memory.api'
import { MEMORY_CLEAN_HINTS, MEMORY_CLEAN_LABELS, MEMORY_CLEAN_RESULT_MS } from '@/constants/memory-clean.constants'
import { useIsElevated } from '@/hooks/useIsElevated'
import type { MemoryCleanError } from '@/types/memory-clean.types'
import { formatBytes } from '@/utils/format.utils'
import { useMutation } from '@tanstack/react-query'

export const useMemoryClean = () => {
  const isElevated = useIsElevated()
  const clean = useMutation<number, MemoryCleanError>({
    mutationFn: cleanMemory,
    onSuccess: () => setTimeout(() => clean.reset(), MEMORY_CLEAN_RESULT_MS),
  })
  const relaunch = useMutation({ mutationFn: relaunchAsAdmin })

  // known up front (shield on the button), or learned from a refused clean
  const isElevationRequired = isElevated === false || clean.error?.kind === 'adminRequired'
  const isPending = clean.isPending || relaunch.isPending
  // Under `tauri dev` a relaunch opens the debug exe's console window and the new copy has no dev server
  const canRelaunch = !import.meta.env.DEV

  const getLabel = () => {
    if (isPending) return MEMORY_CLEAN_LABELS.pending
    if (clean.isError && !isElevationRequired) return MEMORY_CLEAN_LABELS.failed
    if (clean.isSuccess) {
      const freed = formatBytes(clean.data)
      return `Freed ${freed.value} ${freed.unit}`
    }
    return MEMORY_CLEAN_LABELS.idle
  }

  return {
    label: getLabel(),
    isPending,
    isElevationRequired,
    hint: isElevationRequired ? MEMORY_CLEAN_HINTS[canRelaunch ? 'elevation' : 'devElevation'] : undefined,
    run: () => {
      if (!isElevationRequired) clean.mutate()
      else if (canRelaunch) relaunch.mutate()
    },
  }
}
