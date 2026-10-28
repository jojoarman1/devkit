export const MEMORY_CLEAN_LABELS = {
  idle: 'Clear',
  pending: 'Clearing',
  failed: 'Failed, try again',
} as const

// in dev a relaunch is skipped (console window, no dev server)
export const MEMORY_CLEAN_HINTS = {
  elevation: 'Needs administrator rights: restarts devkit as admin',
  devElevation: 'Dev build: run the terminal as admin to clear memory',
} as const

export const MEMORY_CLEAN_RESULT_MS = 2500
