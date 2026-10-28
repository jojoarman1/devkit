import { SegmentedControl } from '@/components/SegmentedControl'
import { THEME_LABELS, THEMES } from '@/constants/theme.constants'
import type { Theme } from '@/types/theme.types'

interface ThemePickerProps {
  value: Theme
  onChange: (theme: Theme) => void
}

export const ThemePicker = ({ value, onChange }: ThemePickerProps) => (
  <SegmentedControl
    label="Theme"
    options={THEMES}
    labels={THEME_LABELS}
    value={value}
    onChange={onChange}
  />
)
