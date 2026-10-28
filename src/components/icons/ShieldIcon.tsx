import type { ComponentProps } from 'react'

// Quadrants are separate paths, so no clipPath id is needed.
export const ShieldIcon = (props: ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 16 16"
    aria-hidden
    {...props}
  >
    <path
      className="fill-shield-blue"
      d="M8 1 2 3v5h6Z"
    />
    <path
      className="fill-shield-yellow"
      d="M8 1l6 2v5H8Z"
    />
    <path
      className="fill-shield-yellow"
      d="M2 8c0 3.5 2.5 6 6 7V8Z"
    />
    <path
      className="fill-shield-blue"
      d="M14 8c0 3.5-2.5 6-6 7V8Z"
    />
  </svg>
)
