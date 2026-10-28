import { Card } from '@/components/Card'
import { PixelNumber } from '@/components/PixelNumber'
import { LOADING_READING } from '@/constants/metric.constants'
import type { MetricReading } from '@/types/metric.types'
import { cn } from '@/utils/cn.utils'
import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  reading: MetricReading | null
  // pinned to the card's bottom edge by its own mt-auto
  action?: ReactNode
  isHighMemory?: boolean
}

export const MetricCard = ({ title, reading, action, isHighMemory = false }: MetricCardProps) => {
  const { status, value } = reading ?? LOADING_READING

  return (
    <Card className="relative isolate h-[544em] w-[550em] overflow-hidden">
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 motion-reduce:transition-none',
          isHighMemory && 'opacity-100',
        )}
      >
        <span className={cn('absolute inset-0', isHighMemory && 'ram-glow-active')} style={{
          background: 'linear-gradient(to bottom, #FF0004 0%, rgb(255 0 4 / 80%) 12%, rgb(255 0 4 / 35%) 30%, transparent 52%)',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 100%, transparent 68%, #000 92%)',
        }}>
          <span className={cn('ram-glow-noise absolute inset-0', isHighMemory && 'ram-glow-noise-active')} />
        </span>
      </span>
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
