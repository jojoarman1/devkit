import { CloseIcon } from '@/components/icons/CloseIcon'
import { SettingsIcon } from '@/components/icons/SettingsIcon'
import { SettingsSwitch } from '@/components/SettingsSwitch'
import { ThemePicker } from '@/components/ThemePicker'
import { useDismiss } from '@/hooks/useDismiss'
import { useRunAsAdmin } from '@/hooks/useRunAsAdmin'
import { useSettings } from '@/hooks/useSettings'
import { useRef } from 'react'

interface SettingsDialogProps {
  onClose: () => void
}

// Sized in px like the caption and the menu: app chrome, not part of the Figma-scaled dashboard
export const SettingsDialog = ({ onClose }: SettingsDialogProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const { settings, isPending, updateSettings } = useSettings()
  const { isRunAsAdmin, toggleRunAsAdmin } = useRunAsAdmin()
  useDismiss(panelRef, true, onClose)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        aria-labelledby="settings-title"
        className="relative w-[400px] rounded-[28px] border border-dialog-stroke bg-card p-6 text-foreground shadow-2xl shadow-black/25"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-button text-foreground/70 transition-colors duration-150 hover:bg-button-hover hover:text-foreground"
        >
          <CloseIcon className="size-3.5" />
        </button>

        <span className="flex size-10 items-center justify-center rounded-full bg-button">
          <SettingsIcon className="size-5" />
        </span>
        <h2
          id="settings-title"
          className="mt-4 text-[18px] font-medium"
        >
          Settings
        </h2>
        <p className="mt-1 text-[15px] text-foreground/60">Appearance and behavior of devkit.</p>

        <h3 className="mt-5 mb-2 text-[14px] text-foreground/60">Theme</h3>
        <ThemePicker
          value={settings.theme}
          onChange={theme => updateSettings({ theme })}
        />

        <h3 className="mt-5 mb-1 text-[14px] text-foreground/60">General</h3>
        <SettingsSwitch
          label="Run as administrator on startup"
          isChecked={isRunAsAdmin}
          isDisabled={isPending}
          onToggle={toggleRunAsAdmin}
        />
        <SettingsSwitch
          label="Minimize and close to tray"
          isChecked={settings.minimizeToTray}
          isDisabled={isPending}
          onToggle={() => updateSettings({ minimizeToTray: !settings.minimizeToTray })}
        />

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
