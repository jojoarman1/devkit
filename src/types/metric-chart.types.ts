export interface ChartLabels {
  start: string
  end: string
}

// Values and positions are normalized to 0..1
export type MetricChart =
  | { kind: 'range'; position: number; labels: ChartLabels }
  | { kind: 'history'; values: (number | null)[]; labels: ChartLabels }
  | { kind: 'timeline'; litCount: number; labels: ChartLabels }
