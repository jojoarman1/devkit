import type { ComponentProps } from 'react'

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
