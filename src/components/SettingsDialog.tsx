import { CloseIcon } from '@/components/icons/CloseIcon'
import { useDismiss } from '@/hooks/useDismiss'
import { useRef } from 'react'
import { SettingsIcon } from '@/components/icons/SettingsIcon'
import { SettingsSwitch } from '@/components/SettingsSwitch'
import { ThemePicker } from '@/components/ThemePicker'
import { UpdateSection } from '@/components/UpdateSection'
import { TOGGLE_SHORTCUT_LABEL } from '@/constants/updates.constants'
import { useAutostart } from '@/hooks/useAutostart'
import { useRunAsAdmin } from '@/hooks/useRunAsAdmin'
import { useSettings } from '@/hooks/useSettings'

interface SettingsDialogProps {
  onClose: () => void
}

// Sized in px like the caption and the menu: app chrome, not part of the Figma-scaled dashboard
export const SettingsDialog = ({ onClose }: SettingsDialogProps) => {
  const { settings, isPending, updateSettings } = useSettings()
  const { isRunAsAdmin, toggleRunAsAdmin } = useRunAsAdmin()
  const autostart = useAutostart()
  const panelRef = useRef<HTMLDivElement>(null)
  useDismiss(panelRef, true, onClose)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        aria-labelledby="settings-title"
        className="relative max-h-[calc(100vh-32px)] w-100 overflow-y-auto rounded-[28px] border border-dialog-stroke bg-card p-6 text-foreground shadow-2xl shadow-black/25"
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
      <p className="mt-1 text-[15px] text-foreground/60">
        Appearance and behavior of devkit.
      </p>

      <h3 className="mt-5 mb-2 text-[14px] text-foreground/60">Theme</h3>
      <ThemePicker
        value={settings.theme}
        onChange={theme => updateSettings({ theme })}
      />

      <h3 className="mt-5 mb-1 text-[14px] text-foreground/60">General</h3>
      <SettingsSwitch
        label="Start with Windows"
        isChecked={autostart.isAutostartEnabled}
        isDisabled={autostart.isPending || !autostart.isAutostartAvailable}
        onToggle={autostart.toggleAutostart}
      />
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
        onToggle={() =>
          updateSettings({ minimizeToTray: !settings.minimizeToTray })
        }
      />
      <SettingsSwitch
        label="Notify when RAM is almost full"
        isChecked={settings.notifyHighMemory}
        isDisabled={isPending}
        onToggle={() => updateSettings({ notifyHighMemory: !settings.notifyHighMemory })}
      />
      <p className="mt-1 text-[14px] text-foreground/60">Show or hide devkit from anywhere: {TOGGLE_SHORTCUT_LABEL}</p>

      <h3 className="mt-5 mb-1 text-[14px] text-foreground/60">Updates</h3>
      <UpdateSection />

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
