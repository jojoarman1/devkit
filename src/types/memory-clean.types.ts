// Mirrors CleanError in src-tauri/src/memory_clean.rs (serde tag = "kind")
export type MemoryCleanError = { kind: 'adminRequired' } | { kind: 'unsupported' } | { kind: 'failed'; message: string }
