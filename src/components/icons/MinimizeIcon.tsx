import type { ComponentProps } from 'react'

export const MinimizeIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width={10}
    height={10}
    viewBox="0 0 10 10"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden
    {...props}
  >
    <rect
      x={0}
      y={5}
      width={10}
      height={1}
    />
  </svg>
)
