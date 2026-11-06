import { RANGE_TICKS } from '@/constants/metric-chart.constants'

interface RangeChartProps {
  position: number
}

export const RangeChart = ({ position }: RangeChartProps) => (
  <div className="relative flex h-full items-end justify-between">
    {RANGE_TICKS.map(tick => (
      <span
        key={tick}
        className="h-[22em] w-[2em] bg-foreground/25"
      />
    ))}
    <span
      className="absolute bottom-0 h-[22em] w-[56em] bg-foreground transition-[left] duration-300 motion-reduce:transition-none"
      style={{ left: `calc(${position} * (100% - 56em))` }}
    />
  </div>
)
