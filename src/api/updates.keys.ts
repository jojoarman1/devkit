export const updatesKeys = {
  all: ['updates'] as const,
  version: () => [...updatesKeys.all, 'version'] as const,
}
