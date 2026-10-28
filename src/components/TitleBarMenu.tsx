import { MoreIcon } from '@/components/icons/MoreIcon'
import { SettingsDialog } from '@/components/SettingsDialog'
import { TitleBarButton } from '@/components/TitleBarButton'
import { useRunAsAdmin } from '@/hooks/useRunAsAdmin'
import { useSettings } from '@/hooks/useSettings'
import { LogicalPosition } from '@tauri-apps/api/dpi'
import { Menu } from '@tauri-apps/api/menu'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

interface TitleBarMenuProps {
  isWindowFocused: boolean
}

export const TitleBarMenu = ({ isWindowFocused }: TitleBarMenuProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const menuRef = useRef<Menu | null>(null)
  const isOpeningRef = useRef(false)
  const generationRef = useRef(0)
  const { isRunAsAdmin, isPending, toggleRunAsAdmin } = useRunAsAdmin()
  const { settings, updateSettings } = useSettings()

  useEffect(() => () => {
    generationRef.current += 1
    void menuRef.current?.close().catch(console.error)
    menuRef.current = null
  }, [])

  const openMenu = async (event: MouseEvent<HTMLButtonElement>) => {
    if (isOpeningRef.current) return
    const { left, bottom } = event.currentTarget.getBoundingClientRect()
    const generation = generationRef.current
    isOpeningRef.current = true

    try {
      await menuRef.current?.close()
      menuRef.current = null
      const menu = await Menu.new({
        items: [
          { id: 'settings', text: 'Settings', action: () => setIsSettingsOpen(true) },
          { item: 'Separator' },
          {
            id: 'run-as-admin',
            text: 'Run as administrator on startup',
            checked: isRunAsAdmin,
            enabled: !isPending,
            action: () => { void toggleRunAsAdmin().catch(console.error) },
          },
          {
            id: 'minimize-to-tray',
            text: 'Minimize and close to tray',
            checked: settings.minimizeToTray,
            enabled: !isPending,
            action: () => updateSettings({ minimizeToTray: !settings.minimizeToTray }),
          },
        ],
      })
      if (generation !== generationRef.current) {
        await menu.close()
        return
      }
      menuRef.current = menu
      await menu.popup(new LogicalPosition(left + 8, bottom))
    } catch (error) {
      console.error('Failed to open title bar menu:', error)
    } finally {
      isOpeningRef.current = false
    }
  }

  return (
    <div>
      <TitleBarButton
        isWindowFocused={isWindowFocused}
        onClick={openMenu}
        aria-label="Menu"
        aria-haspopup="menu"
      >
        <MoreIcon />
      </TitleBarButton>
      {isSettingsOpen && <SettingsDialog onClose={() => setIsSettingsOpen(false)} />}
    </div>
  )
}
