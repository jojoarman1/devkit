import { CheckIcon } from '@/components/icons/CheckIcon'
import type { ComponentProps } from 'react'

interface MenuCheckItemProps extends Omit<ComponentProps<'button'>, 'role'> {
  isChecked: boolean
}

export const MenuCheckItem = ({ isChecked, children, ...props }: MenuCheckItemProps) => (
  <button
    type="button"
    role="menuitemcheckbox"
    aria-checked={isChecked}
    className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-[15px] text-foreground transition-colors duration-100 hover:bg-caption-hover active:bg-caption-pressed disabled:opacity-60"
    {...props}
  >
    <span className="flex size-4 shrink-0 items-center justify-center">
      {isChecked && <CheckIcon />}
    </span>
    {children}
  </button>
)
