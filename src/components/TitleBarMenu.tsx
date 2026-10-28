import { MoreIcon } from '@/components/icons/MoreIcon'
import { MenuCheckItem } from '@/components/MenuCheckItem'
import { TitleBarButton } from '@/components/TitleBarButton'
import { useDismiss } from '@/hooks/useDismiss'
import { useRunAsAdmin } from '@/hooks/useRunAsAdmin'
import { useCallback, useRef, useState } from 'react'

interface TitleBarMenuProps {
  isWindowFocused: boolean
}

// Spotify-style "…" app menu at the left of the caption
export const TitleBarMenu = ({ isWindowFocused }: TitleBarMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { isRunAsAdmin, isPending, toggleRunAsAdmin } = useRunAsAdmin()
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(menuRef, isOpen, close)

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <TitleBarButton
        isWindowFocused={isWindowFocused}
        onClick={() => setIsOpen(previous => !previous)}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <MoreIcon />
      </TitleBarButton>
      {isOpen && (
        <div
          role="menu"
          className="absolute top-full left-2 z-50 w-64 rounded-lg border border-card-stroke bg-card p-1 shadow-lg shadow-black/30"
        >
          <MenuCheckItem
            isChecked={isRunAsAdmin}
            disabled={isPending}
            onClick={toggleRunAsAdmin}
          >
            Run as administrator on startup
          </MenuCheckItem>
        </div>
      )}
    </div>
  )
}
