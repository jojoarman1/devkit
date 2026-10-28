import { AppIcon } from '@/components/AppIcon'
import type { ProcessStats } from '@/types/system.types'
import { formatBytes } from '@/utils/format.utils'

const COLUMNS = [
  { key: 'name', label: 'Process' },
  { key: 'cpuPercent', label: 'CPU' },
  { key: 'memoryBytes', label: 'Memory' },
] as const

export const ProcessesTable = ({ processes }: { processes: ProcessStats[] | null }) => {
  const rows = processes ?? []

  return (
    <>
      <colgroup><col className="w-[60%]" /><col className="w-[20%]" /><col className="w-[20%]" /></colgroup>
      <thead className="sr-only">
        <tr>
          {COLUMNS.map(column => (
            <th
              key={column.key}
              scope="col"
            >
              <span className="text-metric-row text-foreground/60">{column.label}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(process => {
          const memory = formatBytes(process.memoryBytes)
          return (
            <tr key={process.name} className="transition-colors hover:bg-card-raised">
              <td className="py-[6em] pr-[20em]">
                <div className="flex min-w-0 items-center gap-[20em]">
                  <AppIcon path={process.exePath} />
                  <span className="min-w-0 text-metric-row wrap-anywhere">{process.name}</span>
                </div>
              </td>
              <td className="py-[6em] text-right whitespace-nowrap"><span className="text-metric-row tabular-nums">{process.cpuPercent.toFixed(1)}<span className="ml-1 text-foreground/40">%</span></span></td>
              <td className="py-[6em] text-right whitespace-nowrap"><span className="text-metric-row tabular-nums">{memory.value}<span className="ml-1 text-foreground/40">{memory.unit}</span></span></td>
            </tr>
          )
        })}
        {!rows.length && <tr><td colSpan={3} className="py-[64em] text-center"><span role="status" className="text-metric-row text-foreground/50">{processes ? 'No processes found' : 'Loading processes...'}</span></td></tr>}
      </tbody>
    </>
  )
}
