import type { ComponentProps } from 'react'

interface PinIconProps extends ComponentProps<'svg'> {
  isFilled?: boolean
}

export const PinIcon = ({ isFilled = false, ...props }: PinIconProps) => (
  <svg
    width={10}
    height={10}
    viewBox="0 0 10 10"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden
    {...props}
  >
    {isFilled ? (
      <rect
        x={2}
        y={0}
        width={6}
        height={5}
      />
    ) : (
      <path d="M2 0h6v1H2zM2 1h1v3H2zM7 1h1v3H7z" />
    )}
    <rect
      x={0}
      y={4}
      width={10}
      height={1}
    />
    <rect
      x={4}
      y={5}
      width={2}
      height={5}
    />
  </svg>
)
