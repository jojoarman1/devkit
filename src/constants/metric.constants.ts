import type { MetricReading, MetricStatus, MetricThresholds } from '@/types/metric.types'

export const METRIC_STATUSES = ['balanced', 'high', 'critical'] as const

export const METRIC_STATUS_LABELS: Record<MetricStatus, string> = {
  balanced: 'balanced',
  high: 'high',
  critical: 'critical',
}

export const LOADING_READING: MetricReading = { status: 'loading', value: '--' }

export const UNAVAILABLE_READING: MetricReading = { status: 'unavailable', value: '--' }

// Windows reports the sensor class as not implemented on this board: an access problem would read differently
export const UNSUPPORTED_READING: MetricReading = { status: 'not supported', value: '--' }

export const CPU_THRESHOLDS: MetricThresholds = { high: 70, critical: 90 }

export const MEMORY_THRESHOLDS: MetricThresholds = { high: 70, critical: 90 }

export const TEMPERATURE_THRESHOLDS: MetricThresholds = { high: 75, critical: 90 }
