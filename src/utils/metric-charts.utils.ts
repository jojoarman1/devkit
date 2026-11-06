import {
  DISK_CHART_LABELS,
  HISTORY_LABELS,
  HISTORY_LENGTH,
  NETWORK_CHART_FLOOR_BYTES,
  TEMPERATURE_CHART_LABELS,
  TEMPERATURE_CHART_RANGE,
  TIMELINE_DOT_COUNT,
  UPTIME_CHART_LABELS,
} from '@/constants/metric-chart.constants'
import type { MetricChart } from '@/types/metric-chart.types'
import type { SystemStats } from '@/types/system.types'
import { getSystemDisk } from '@/utils/metric.utils'

const SECONDS_PER_HOUR = 3600

const clampUnit = (value: number) => Math.min(1, Math.max(0, value))

// Right-aligned like the reference: the newest sample sits at "now", empty slots fill the left
const toHistorySlots = (values: number[]) => [
  ...Array<null>(Math.max(0, HISTORY_LENGTH - values.length)).fill(null),
  ...values.slice(-HISTORY_LENGTH),
]

export const getCpuChart = (_stats: SystemStats, history: SystemStats[]): MetricChart => ({
  kind: 'history',
  values: toHistorySlots(history.map(({ cpu }) => clampUnit(cpu.usagePercent / 100))),
  labels: HISTORY_LABELS,
})

// Scaled to the busiest second in the window, so a download spike stays readable next to idle traffic
export const getNetworkChart = (_stats: SystemStats, history: SystemStats[]): MetricChart => {
  const rates = history.map(({ network }) => network.receivedBytesPerSecond)
  const peak = Math.max(NETWORK_CHART_FLOOR_BYTES, ...rates)
  return { kind: 'history', values: toHistorySlots(rates.map(rate => rate / peak)), labels: HISTORY_LABELS }
}

export const getDiskChart = ({ disks }: SystemStats): MetricChart | null => {
  const disk = getSystemDisk(disks)
  if (!disk || disk.totalBytes === 0) return null

  const position = (disk.totalBytes - disk.availableBytes) / disk.totalBytes
  return { kind: 'range', position: clampUnit(position), labels: DISK_CHART_LABELS }
}

export const getTemperatureChart = ({ temperature: { cpuCelsius, gpuCelsius } }: SystemStats): MetricChart | null => {
  const celsius = cpuCelsius ?? gpuCelsius
  if (celsius === null) return null

  const { min, max } = TEMPERATURE_CHART_RANGE
  return { kind: 'range', position: clampUnit((celsius - min) / (max - min)), labels: TEMPERATURE_CHART_LABELS }
}

// One dot per hour of the last day; the lit ones are the hours the machine has been up
export const getUptimeChart = ({ uptimeSeconds }: SystemStats): MetricChart => ({
  kind: 'timeline',
  litCount: Math.min(TIMELINE_DOT_COUNT, Math.ceil(uptimeSeconds / SECONDS_PER_HOUR)),
  labels: UPTIME_CHART_LABELS,
})
