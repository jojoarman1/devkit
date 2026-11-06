import { TIMELINE_DOT_COUNT, TIMELINE_DOTS } from '@/constants/metric-chart.constants'
import { cn } from '@/utils/cn.utils'

interface TimelineChartProps {
  litCount: number
}

export const TimelineChart = ({ litCount }: TimelineChartProps) => (
  <div className="flex h-full items-center justify-between">
    {TIMELINE_DOTS.map(dot => {
      const isNow = dot === TIMELINE_DOT_COUNT - 1
      const isLit = dot >= TIMELINE_DOT_COUNT - litCount
      return (
        <span
          key={dot}
          className={cn(
            'size-[8em] rounded-full bg-foreground/25',
            isLit && 'bg-foreground',
            isNow && 'size-[22em] bg-foreground',
          )}
        />
      )
    })}
  </div>
)
