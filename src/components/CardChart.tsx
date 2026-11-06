import { HistoryChart } from '@/components/HistoryChart'
import { RangeChart } from '@/components/RangeChart'
import { TimelineChart } from '@/components/TimelineChart'
import type { MetricChart } from '@/types/metric-chart.types'

interface CardChartProps {
  chart: MetricChart
}

const ChartStrip = ({ chart }: CardChartProps) => {
  switch (chart.kind) {
    case 'range':
      return <RangeChart position={chart.position} />
    case 'history':
      return <HistoryChart values={chart.values} />
    case 'timeline':
      return <TimelineChart litCount={chart.litCount} />
  }
}

// Sizes stay on the unit-font wrappers; only the label spans set a text size (see "Em gotcha")
export const CardChart = ({ chart }: CardChartProps) => (
  <div className="mt-auto mb-[44em] flex flex-col gap-[18em]">
    <div className="h-[40em]">
      <ChartStrip chart={chart} />
    </div>
    <div className="flex justify-between">
      <span className="text-metric-row text-foreground/60">{chart.labels.start}</span>
      <span className="text-metric-row text-foreground/60">{chart.labels.end}</span>
    </div>
  </div>
)
