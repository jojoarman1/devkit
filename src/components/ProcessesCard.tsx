import { Card } from '@/components/Card'
import { ProcessesTable } from '@/components/ProcessesTable'
import type { ProcessStats } from '@/types/system.types'

interface ProcessesCardProps {
  processes: ProcessStats[] | null
}

export const ProcessesCard = ({ processes }: ProcessesCardProps) => (
  <Card className="col-span-full h-[304em] pt-[44em] pb-[32em]">
    <div className="flex items-baseline gap-[16em]">
      <h2 className="text-metric-status">Processes</h2>
      <span className="text-metric-status text-foreground/60">{processes ? 'top by CPU' : 'loading'}</span>
    </div>
    <table aria-label="Top processes by CPU" className="mt-[24em] w-full table-fixed border-collapse">
      <ProcessesTable processes={processes?.slice(0, 3) ?? null} />
    </table>
  </Card>
)
