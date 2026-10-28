import { MoreIcon } from '@/components/icons/MoreIcon'
import { SettingsIcon } from '@/components/icons/SettingsIcon'
import { MenuCheckItem } from '@/components/MenuCheckItem'
import { MenuItem } from '@/components/MenuItem'
import { SettingsDialog } from '@/components/SettingsDialog'
import { TitleBarButton } from '@/components/TitleBarButton'
import { useDismiss } from '@/hooks/useDismiss'
import { useRunAsAdmin } from '@/hooks/useRunAsAdmin'
import { useSettings } from '@/hooks/useSettings'
import { useCallback, useRef, useState } from 'react'

interface TitleBarMenuProps {
  isWindowFocused: boolean
}

export const TitleBarMenu = ({ isWindowFocused }: TitleBarMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { isRunAsAdmin, isPending, toggleRunAsAdmin } = useRunAsAdmin()
  const { settings, updateSettings } = useSettings()
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(menuRef, isOpen, close)

  const openSettings = () => {
    setIsOpen(false)
    setIsSettingsOpen(true)
  }

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
          className="absolute top-full left-2 z-50 mt-1 w-72 rounded-[14px] border border-dialog-stroke bg-card p-1.5 shadow-xl shadow-black/20"
        >
          <MenuItem
            icon={<SettingsIcon className="size-4" />}
            onClick={openSettings}
          >
            Settings
          </MenuItem>
          <div
            role="separator"
            className="mx-3 my-1.5 h-px bg-line"
          />
          <MenuCheckItem
            isChecked={isRunAsAdmin}
            disabled={isPending}
            onClick={toggleRunAsAdmin}
          >
            Run as administrator on startup
          </MenuCheckItem>
          <MenuCheckItem
            isChecked={settings.minimizeToTray}
            disabled={isPending}
            onClick={() => updateSettings({ minimizeToTray: !settings.minimizeToTray })}
          >
            Minimize and close to tray
          </MenuCheckItem>
        </div>
      )}
      {isSettingsOpen && <SettingsDialog onClose={() => setIsSettingsOpen(false)} />}
    </div>
  )
}
