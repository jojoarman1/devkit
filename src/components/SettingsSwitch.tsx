import { cn } from '@/utils/cn.utils'

interface SettingsSwitchProps {
  label: string
  isChecked: boolean
  isDisabled?: boolean
  onToggle: () => void
}

export const SettingsSwitch = ({
  label,
  isChecked,
  isDisabled = false,
  onToggle
}: SettingsSwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={isChecked}
    disabled={isDisabled}
    onClick={onToggle}
    className="flex w-full items-center gap-3 py-2 text-left text-[15px] text-foreground disabled:opacity-60"
  >
    <span
      className={cn(
        'relative h-5.5 w-10 shrink-0 rounded-full bg-switch-off transition-colors duration-200',
        isChecked && 'bg-primary'
      )}
    >
      <span
        className={cn(
          'absolute top-0.75 left-0.75 h-4 w-5 rounded-full bg-switch-knob shadow-sm shadow-black/20 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
          isChecked && 'translate-x-3.5 bg-primary-foreground'
        )}
      />
    </span>
    {label}
  </button>
)
