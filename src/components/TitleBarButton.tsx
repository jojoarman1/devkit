import { cn } from '@/utils/cn.utils'
import type { ComponentProps } from 'react'

interface TitleBarButtonProps extends ComponentProps<'button'> {
  isWindowFocused: boolean
  isDanger?: boolean
}

// Native Windows 11 caption metrics, in px on purpose: system chrome must not follow the design scale.
// 46 × 32 with a 10 px icon centred at whole pixels (18, 11); the icon dims while the window is inactive.
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
