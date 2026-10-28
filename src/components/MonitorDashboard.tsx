import { MetricCard } from '@/components/MetricCard'
import { ProcessesCard } from '@/components/ProcessesCard'
import { METRIC_CARDS } from '@/constants/metric-cards.constants'
import { useSystemStats } from '@/hooks/useSystemStats'

export const MonitorDashboard = () => {
  const stats = useSystemStats()

  return (
    // Figma: 3 columns of 550 with a 16 gap; the processes card spans the full width below
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
