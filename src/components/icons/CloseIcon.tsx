import type { ComponentProps } from 'react'

// 10 × 10 px with 1 px diagonals corner to corner, like the Windows 11 caption glyph
export const CloseIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width={10}
    height={10}
    viewBox="0 0 10 10"
    stroke="currentColor"
    strokeWidth={1}
    aria-hidden
    {...props}
  >
    <path d="M0 0 10 10M10 0 0 10" />
  </svg>
)
