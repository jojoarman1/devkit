import type { ComponentProps, ReactNode } from 'react'

interface MenuItemProps extends Omit<ComponentProps<'button'>, 'role'> {
  icon?: ReactNode
}

// Shares the icon column with MenuCheckItem, so labels line up
export const MenuItem = ({ icon, children, ...props }: MenuItemProps) => (
  <button
    type="button"
    role="menuitem"
    className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-[15px] text-foreground transition-colors duration-100 hover:bg-caption-hover active:bg-caption-pressed"
    {...props}
  >
    <span className="flex size-4 shrink-0 items-center justify-center text-foreground/70">{icon}</span>
    {children}
  </button>
)
