import { cn } from '@/utils/cn.utils'
import type { ComponentProps } from 'react'

export const Spinner = ({ className, ...props }: ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn('size-4 shrink-0 animate-spin motion-reduce:animate-none', className)}
    {...props}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path
      d="M12 3a9 9 0 0 1 9 9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)
