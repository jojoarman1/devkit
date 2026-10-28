import { MetricCard } from '@/components/MetricCard'
import { ProcessesCard } from '@/components/ProcessesCard'
import { METRIC_CARDS } from '@/constants/metric-cards.constants'
import { MEMORY_THRESHOLDS } from '@/constants/metric.constants'
import { useSystemStats } from '@/hooks/useSystemStats'
import { getUsagePercent } from '@/utils/metric.utils'

export const MonitorDashboard = () => {
  const stats = useSystemStats()

  return (
    <section className="grid grid-cols-[repeat(3,550em)] gap-[16em]">
      {METRIC_CARDS.map(card => (
        <MetricCard
          key={card.id}
          title={card.title}
          isHighMemory={card.id === 'ram' && !!stats && getUsagePercent(stats.memory.usedBytes, stats.memory.totalBytes) >= MEMORY_THRESHOLDS.high}
          reading={stats ? card.getReading(stats) : null}
          action={!!card.Action && <card.Action />}
        />
      ))}
      <ProcessesCard processes={stats?.processes ?? null} />
    </section>
  )
}
