import { ShieldIcon } from '@/components/icons/ShieldIcon'
import { useMemoryClean } from '@/hooks/useMemoryClean'

// A full-width capsule at the bottom of the RAM card, inset 16 (8 screen px) from the bottom and sides
// (-28 offsets the card's 44 padding). Being fully round, it doesn't have to follow the card's
// squircle corners (an inset squircle can't be made truly concentric). Plain round on purpose: a squircle
// capsule gets boxy ends.
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
      <span className="text-metric-status">{label}</span>
    </button>
  )
}
