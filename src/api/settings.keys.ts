export const settingsKeys = {
  all: ['settings'] as const,
  runAsAdmin: () => [...settingsKeys.all, 'run-as-admin'] as const,
}
