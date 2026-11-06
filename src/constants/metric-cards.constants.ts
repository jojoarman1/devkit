import { MemoryCleanButton } from '@/components/MemoryCleanButton'
import type { MetricCardConfig } from '@/types/metric.types'
import {
  getCpuChart,
  getDiskChart,
  getNetworkChart,
  getTemperatureChart,
  getUptimeChart,
} from '@/utils/metric-charts.utils'
import {
  getCpuReading,
  getDiskReading,
  getMemoryReading,
  getNetworkReading,
  getTemperatureReading,
  getUptimeReading,
} from '@/utils/metric-readings.utils'

// RAM has no chart: its Clean button takes the bottom of the card
export const METRIC_CARDS: MetricCardConfig[] = [
  { id: 'cpu', title: 'Cpu', getReading: getCpuReading, getChart: getCpuChart },
  { id: 'ram', title: 'Ram', getReading: getMemoryReading, Action: MemoryCleanButton },
  { id: 'disk', title: 'Disk', getReading: getDiskReading, getChart: getDiskChart },
  { id: 'network', title: 'Network', getReading: getNetworkReading, getChart: getNetworkChart },
  { id: 'temperature', title: 'Temp', getReading: getTemperatureReading, getChart: getTemperatureChart },
  { id: 'uptime', title: 'Uptime', getReading: getUptimeReading, getChart: getUptimeChart },
]
