import { MetricCard } from '@/components/MetricCard'
import { ProcessesCard } from '@/components/ProcessesCard'
import { METRIC_CARDS } from '@/constants/metric-cards.constants'
import { useSystemStats } from '@/hooks/useSystemStats'

export const MonitorDashboard = () => {
  const stats = useSystemStats()

  return (
    <section className="grid grid-cols-[repeat(3,550em)] gap-[16em]">
      {METRIC_CARDS.map(card => (
        <MetricCard
          key={card.id}
          title={card.title}
          reading={stats ? card.getReading(stats) : null}
          action={!!card.Action && <card.Action />}
        />
      ))}
      <ProcessesCard processes={stats?.processes ?? null} />
    </section>
  )
}
