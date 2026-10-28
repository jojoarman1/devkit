import type { ComponentProps } from 'react'

// Three 2 × 2 px dots on whole pixels (16 × 2), centred at (15, 15) in the 46 × 32 caption button
export const MoreIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width={16}
    height={2}
    viewBox="0 0 16 2"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden
    {...props}
  >
    <rect
      x={1}
      width={2}
      height={2}
    />
    <rect
      x={7}
      width={2}
      height={2}
    />
    <rect
      x={13}
      width={2}
      height={2}
    />
  </svg>
)
