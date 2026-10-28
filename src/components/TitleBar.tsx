import { closeWindow, minimizeWindow } from '@/api/window.api'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { MinimizeIcon } from '@/components/icons/MinimizeIcon'
import { PinIcon } from '@/components/icons/PinIcon'
import { TitleBarButton } from '@/components/TitleBarButton'
import { TitleBarMenu } from '@/components/TitleBarMenu'
import { useAlwaysOnTop } from '@/hooks/useAlwaysOnTop'
import { useWindowFocus } from '@/hooks/useWindowFocus'

// Replaces the native caption (decorations: false) the way Spotify does: a "…" menu on the left, no title,
// window buttons on the right. data-tauri-drag-region is not inherited by children, so it sits on the header
// and on the empty spacer between the button groups.
export const TitleBar = () => {
  const { isAlwaysOnTop, toggleAlwaysOnTop } = useAlwaysOnTop()
  const isWindowFocused = useWindowFocus()

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
        onClick={minimizeWindow}
        aria-label="Minimize"
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
