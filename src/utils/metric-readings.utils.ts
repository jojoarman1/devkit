import {
  CPU_THRESHOLDS,
  MEMORY_THRESHOLDS,
  TEMPERATURE_THRESHOLDS,
  UNAVAILABLE_READING,
  UNSUPPORTED_READING,
} from '@/constants/metric.constants'
import type { MetricReading } from '@/types/metric.types'
import type { SystemStats } from '@/types/system.types'
import { formatBytes, formatUptime } from '@/utils/format.utils'
import { getMetricStatusLabel, getUsagePercent } from '@/utils/metric.utils'

// The number carries no unit sign; where the unit isn't obvious it goes into the status line

export const getCpuReading = ({ cpu }: SystemStats): MetricReading => {
  const percent = Math.round(cpu.usagePercent)
  return { status: getMetricStatusLabel(percent, CPU_THRESHOLDS), value: String(percent) }
}

export const getMemoryReading = ({ memory }: SystemStats): MetricReading => {
  const percent = getUsagePercent(memory.usedBytes, memory.totalBytes)
  return { status: getMetricStatusLabel(percent, MEMORY_THRESHOLDS), value: String(percent) }
}

export const getDiskReading = ({ disks }: SystemStats): MetricReading => {
  const disk = disks.find(({ isSystem }) => isSystem) ?? disks[0]
  if (!disk) return UNAVAILABLE_READING

  const percent = getUsagePercent(disk.totalBytes - disk.availableBytes, disk.totalBytes)
  const free = formatBytes(disk.availableBytes)
  return { status: `${free.value} ${free.unit} free`, value: String(percent) }
}

export const getNetworkReading = ({ network }: SystemStats): MetricReading => {
  const download = formatBytes(network.receivedBytesPerSecond)
  const upload = formatBytes(network.transmittedBytesPerSecond)
  return {
    status: `${download.unit}/s down, ${upload.value} ${upload.unit}/s up`,
    value: download.value,
  }
}

// CPU when the board exposes it, otherwise the GPU (NVML); the status names the source
export const getTemperatureReading = ({ temperature: { cpuCelsius, gpuCelsius } }: SystemStats): MetricReading => {
  const source = cpuCelsius !== null ? 'cpu' : 'gpu'
  const reading = cpuCelsius ?? gpuCelsius
  if (reading === null) return UNSUPPORTED_READING

  const celsius = Math.round(reading)
  return { status: `${source} °C, ${getMetricStatusLabel(celsius, TEMPERATURE_THRESHOLDS)}`, value: String(celsius) }
}

export const getUptimeReading = ({ uptimeSeconds }: SystemStats): MetricReading => {
  const { value, unit } = formatUptime(uptimeSeconds)
  return { status: `${unit} since boot`, value }
}
