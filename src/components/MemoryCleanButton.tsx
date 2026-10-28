import { ShieldIcon } from '@/components/icons/ShieldIcon'
import { useMemoryClean } from '@/hooks/useMemoryClean'

// -28 offsets the card's 44 padding. Plain round, not squircle: a squircle capsule gets boxy ends.
export const MemoryCleanButton = () => {
  const { label, hint, isPending, isElevationRequired, run } = useMemoryClean()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={run}
      // keep the card's press spring from firing when only the button is pressed
      onPointerDown={event => event.stopPropagation()}
      title={hint}
      className="mx-[-28em] mt-auto mb-[16em] flex h-[104em] shrink-0 items-center justify-center gap-[14em] rounded-full bg-button transition-colors duration-150 hover:bg-button-hover active:bg-button-pressed disabled:opacity-60"
    >
      {isElevationRequired && <ShieldIcon className="size-[36em] shrink-0" />}
      <span className="text-metric-status font-medium">{label}</span>
    </button>
  )
}
