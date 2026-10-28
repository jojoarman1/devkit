import { MemoryCleanButton } from '@/components/MemoryCleanButton'
import type { MetricCardConfig } from '@/types/metric.types'
import {
  getCpuReading,
  getDiskReading,
  getMemoryReading,
  getNetworkReading,
  getTemperatureReading,
  getUptimeReading,
} from '@/utils/metric-readings.utils'

export const METRIC_CARDS: MetricCardConfig[] = [
  { id: 'cpu', title: 'Cpu', getReading: getCpuReading },
  { id: 'ram', title: 'Ram', getReading: getMemoryReading, Action: MemoryCleanButton },
  { id: 'disk', title: 'Disk', getReading: getDiskReading },
  { id: 'network', title: 'Network', getReading: getNetworkReading },
  { id: 'temperature', title: 'Temp', getReading: getTemperatureReading },
  { id: 'uptime', title: 'Uptime', getReading: getUptimeReading },
]
