import { RANGE_TICKS } from '@/constants/metric-chart.constants'

interface HistoryChartProps {
  values: (number | null)[]
}

// Bars touch, so a run of samples reads as one stepped shape like the reference
export const HistoryChart = ({ values }: HistoryChartProps) => (
  <div className="relative h-full">
    <div className="absolute inset-x-0 bottom-0 flex h-[16em] items-end justify-between">
      {RANGE_TICKS.map(tick => (
        <span
          key={tick}
          className="h-full w-[2em] bg-foreground/25"
        />
      ))}
    </div>
    <div className="relative flex h-full items-end">
      {/* a slot is a position in the window, not a sample: the bars carry no state */}
      {values.map((value, slot) => (
        <span
          key={slot}
          className="flex-1 bg-foreground"
          style={{ height: value === null ? 0 : `max(3em, ${value * 100}%)` }}
        />
      ))}
    </div>
  </div>
)
