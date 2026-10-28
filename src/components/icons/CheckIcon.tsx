import type { ComponentProps } from 'react'

export const CheckIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M2 6.5 4.75 9 10 3" />
  </svg>
)
