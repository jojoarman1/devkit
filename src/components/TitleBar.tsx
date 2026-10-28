import { closeWindow, hideWindow, minimizeWindow } from '@/api/window.api'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { MinimizeIcon } from '@/components/icons/MinimizeIcon'
import { PinIcon } from '@/components/icons/PinIcon'
import { TitleBarButton } from '@/components/TitleBarButton'
import { TitleBarMenu } from '@/components/TitleBarMenu'
import { useAlwaysOnTop } from '@/hooks/useAlwaysOnTop'
import { useSettings } from '@/hooks/useSettings'
import { useWindowFocus } from '@/hooks/useWindowFocus'

// data-tauri-drag-region is not inherited by children, so it sits on the header and on the spacer
export const TitleBar = () => {
  const { isAlwaysOnTop, toggleAlwaysOnTop } = useAlwaysOnTop()
  const isWindowFocused = useWindowFocus()
  const { settings } = useSettings()

  return (
    <header
      data-tauri-drag-region
      className="flex h-8 shrink-0 select-none"
    >
      <TitleBarMenu isWindowFocused={isWindowFocused} />
      <div
        data-tauri-drag-region
        className="flex-1"
      />
      <TitleBarButton
        isWindowFocused={isWindowFocused}
        onClick={toggleAlwaysOnTop}
        aria-label={isAlwaysOnTop ? 'Unpin window' : 'Pin window on top'}
        aria-pressed={isAlwaysOnTop}
      >
        <PinIcon isFilled={isAlwaysOnTop} />
      </TitleBarButton>
      <TitleBarButton
        isWindowFocused={isWindowFocused}
        onClick={settings.minimizeToTray ? hideWindow : minimizeWindow}
        aria-label={settings.minimizeToTray ? 'Minimize to tray' : 'Minimize'}
      >
        <MinimizeIcon />
      </TitleBarButton>
      <TitleBarButton
        isWindowFocused={isWindowFocused}
        isDanger
        onClick={closeWindow}
        aria-label="Close"
      >
        <CloseIcon />
      </TitleBarButton>
    </header>
  )
}
