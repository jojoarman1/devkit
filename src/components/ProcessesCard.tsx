import { Card } from '@/components/Card'
import { ProcessRow } from '@/components/ProcessRow'
import type { ProcessStats } from '@/types/system.types'

interface ProcessesCardProps {
  processes: ProcessStats[] | null
}

// Figma gives this card 280 of height: a header and the top 3 processes as small rows
export const ProcessesCard = ({ processes }: ProcessesCardProps) => (
  <Card className="col-span-full h-[280em] pt-[44em]">
    <div className="flex items-baseline gap-[16em]">
      <h2 className="text-metric-status">Processes</h2>
      <span className="text-metric-status text-foreground/60">{processes ? 'top by CPU' : 'loading'}</span>
    </div>
    <ul className="mt-[24em] grid grid-cols-[40em_1fr_160em_180em] gap-x-[20em] gap-y-[12em]">
      {processes?.map(process => (
        <ProcessRow
          key={process.name}
          process={process}
        />
      ))}
    </ul>
  </Card>
)
