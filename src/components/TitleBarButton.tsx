import { cn } from '@/utils/cn.utils'
import type { ComponentProps } from 'react'

interface TitleBarButtonProps extends ComponentProps<'button'> {
  isWindowFocused: boolean
  isDanger?: boolean
}

// Windows 11 caption metrics in px on purpose: system chrome must not follow the design scale
export const TitleBarButton = ({
  isWindowFocused,
  isDanger = false,
  className,
  ...props
}: TitleBarButtonProps) => (
  <button
    type="button"
    className={cn(
      'flex h-8 w-11.5 items-center justify-center text-foreground transition-colors duration-100',
      'hover:bg-caption-hover hover:text-foreground active:bg-caption-pressed',
      !isWindowFocused && 'text-foreground/36',
      isDanger &&
        'hover:bg-caption-close hover:text-white active:bg-caption-close-pressed',
      className
    )}
    {...props}
  />
)
