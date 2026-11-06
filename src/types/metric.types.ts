import type { METRIC_STATUSES } from '@/constants/metric.constants'
import type { MetricChart } from '@/types/metric-chart.types'
import type { SystemStats } from '@/types/system.types'
import type { ComponentType } from 'react'

export type MetricStatus = (typeof METRIC_STATUSES)[number]

export type MetricThresholds = Record<Exclude<MetricStatus, 'balanced'>, number>

export interface MetricReading {
  status: string
  value: string
}

export interface MetricCardConfig {
  id: string
  title: string
  getReading: (stats: SystemStats) => MetricReading
  // history is the last minute of samples, oldest first, ending with stats
  getChart?: (stats: SystemStats, history: SystemStats[]) => MetricChart | null
  Action?: ComponentType
}
