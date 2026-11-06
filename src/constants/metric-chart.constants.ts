import type { ChartLabels } from '@/types/metric-chart.types'

export const HISTORY_LENGTH = 60

// The monitor stops emitting while the window is hidden; samples on both sides of a longer
// silence aren't one continuous minute, so the history starts over
export const HISTORY_GAP_MS = 3000

export const RANGE_TICK_COUNT = 24
export const TIMELINE_DOT_COUNT = 24

export const RANGE_TICKS = Array.from({ length: RANGE_TICK_COUNT }, (_, tick) => tick)
export const TIMELINE_DOTS = Array.from({ length: TIMELINE_DOT_COUNT }, (_, dot) => dot)

export const TEMPERATURE_CHART_RANGE = { min: 30, max: 100 }

// Below this the network is idle; without a floor a few KB/s of background traffic would fill the chart
export const NETWORK_CHART_FLOOR_BYTES = 100 * 1024

export const HISTORY_LABELS: ChartLabels = { start: '60 s', end: 'now' }
export const DISK_CHART_LABELS: ChartLabels = { start: 'empty', end: 'full' }
export const TEMPERATURE_CHART_LABELS: ChartLabels = { start: 'cool', end: 'hot' }
export const UPTIME_CHART_LABELS: ChartLabels = { start: '24 h ago', end: 'now' }
