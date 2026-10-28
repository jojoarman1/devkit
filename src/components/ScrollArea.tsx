import { cn } from '@/utils/cn.utils'
import type { ComponentProps } from 'react'

export const ScrollArea = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    tabIndex={0}
    {...props}
    className={cn('scroll-area min-h-0 overflow-y-auto overscroll-contain', className)}
  />
)
