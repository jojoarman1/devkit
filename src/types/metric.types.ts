import type { METRIC_STATUSES } from '@/constants/metric.constants'
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
  Action?: ComponentType
}
