import { error } from '@tauri-apps/plugin-log'

// Goes to the same devkit.log as the Rust side; a release build has no devtools console to read
export const logError = (context: string, cause: unknown) =>
  error(`${context}: ${cause instanceof Error ? cause.message : String(cause)}`)
