import { cn } from '@/utils/cn.utils'

interface SegmentedControlProps<T extends string> {
  options: readonly T[]
  labels: Record<T, string>
  value: T
  label: string
  onChange: (value: T) => void
}

// One shared thumb slides under the options instead of each option toggling its own background
export const SegmentedControl = <T extends string>({
  options,
  labels,
  value,
  label,
  onChange,
}: SegmentedControlProps<T>) => {
  const selectedIndex = options.indexOf(value)

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="relative grid auto-cols-fr grid-flow-col rounded-full bg-button p-1"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-full bg-card shadow-sm shadow-black/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
      {options.map(option => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          onClick={() => onChange(option)}
          className={cn(
            'relative h-8 rounded-full text-[15px] font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground',
            option === value && 'text-foreground',
          )}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  )
}
