export const elevationKeys = {
  all: ['elevation'] as const,
  isElevated: () => [...elevationKeys.all, 'is-elevated'] as const,
}
