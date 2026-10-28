import { CheckIcon } from '@/components/icons/CheckIcon'
import type { ComponentProps } from 'react'

interface MenuCheckItemProps extends Omit<ComponentProps<'button'>, 'role'> {
  isChecked: boolean
}

// Windows 11 style menu row in px (system chrome, like the caption): 32 high, check column on the left
export const MenuCheckItem = ({ isChecked, children, ...props }: MenuCheckItemProps) => (
  <button
    type="button"
    role="menuitemcheckbox"
    aria-checked={isChecked}
    className="flex h-8 w-full items-center gap-2 rounded-[4px] px-2 text-left text-[13px] text-foreground transition-colors duration-100 hover:bg-caption-hover active:bg-caption-pressed disabled:opacity-60"
    {...props}
  >
    <span className="flex size-4 shrink-0 items-center justify-center">{isChecked && <CheckIcon />}</span>
    {children}
  </button>
)
