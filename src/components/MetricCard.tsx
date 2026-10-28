import { Card } from '@/components/Card'
import { PixelNumber } from '@/components/PixelNumber'
import { LOADING_READING } from '@/constants/metric.constants'
import type { MetricReading } from '@/types/metric.types'
import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  reading: MetricReading | null
  // pinned to the card's bottom edge by its own mt-auto
  action?: ReactNode
}

export const MetricCard = ({ title, reading, action }: MetricCardProps) => {
  const { status, value } = reading ?? LOADING_READING

  return (
    <Card className="h-[544em] w-[550em]">
      <h2 className="text-metric-title">{title}</h2>
      <p className="truncate text-metric-status text-foreground/60">{status}</p>
      <PixelNumber
        value={value}
        // -29 drops the empty space below the baseline in the 200 line box, so a bottom action fits
        className="mt-[13em] mb-[-29em] h-[200em] w-fit max-w-full"
      />
      {action}
    </Card>
  )
}
