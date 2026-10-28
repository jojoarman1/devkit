import { AppIcon } from '@/components/AppIcon'
import type { ProcessStats } from '@/types/system.types'
import { formatBytes } from '@/utils/format.utils'

interface ProcessRowProps {
  process: ProcessStats
}

// Text classes stay on the leaf spans, so the grid's em sizes still resolve against the unit font size
export const ProcessRow = ({ process }: ProcessRowProps) => {
  const memory = formatBytes(process.memoryBytes)

  return (
    <li className="col-span-full grid grid-cols-subgrid items-center">
      <AppIcon path={process.exePath} />
      <span className="truncate text-metric-row">{process.name}</span>
      <span className="text-right text-metric-row text-foreground/60 tabular-nums">
        {process.cpuPercent.toFixed(1)}%
      </span>
      <span className="text-right text-metric-row text-foreground/60 tabular-nums">
        {memory.value} {memory.unit}
      </span>
    </li>
  )
}
