import { METRIC_STATUS_LABELS } from '@/constants/metric.constants'
import type { MetricStatus, MetricThresholds } from '@/types/metric.types'
import type { DiskStats } from '@/types/system.types'

export const getSystemDisk = (disks: DiskStats[]) => disks.find(({ isSystem }) => isSystem) ?? disks[0]

export const getMetricStatus = (percent: number, thresholds: MetricThresholds): MetricStatus => {
  if (percent >= thresholds.critical) return 'critical'
  if (percent >= thresholds.high) return 'high'
  return 'balanced'
}

export const getMetricStatusLabel = (percent: number, thresholds: MetricThresholds) =>
  METRIC_STATUS_LABELS[getMetricStatus(percent, thresholds)]

export const getUsagePercent = (used: number, total: number) => {
  if (total === 0) return 0
  return Math.round((used / total) * 100)
}
