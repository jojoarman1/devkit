export const UPDATE_LABELS = {
  check: 'Check for updates',
  checking: 'Checking…',
  upToDate: 'Up to date',
  failed: 'Check failed, try again',
  installing: 'Installing…',
} as const

// must match TOGGLE_SHORTCUT in src-tauri/src/plugins.rs
export const TOGGLE_SHORTCUT_LABEL = 'Ctrl+Shift+D'
