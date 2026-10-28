export const windowKeys = {
  all: ['window'] as const,
  alwaysOnTop: () => [...windowKeys.all, 'always-on-top'] as const,
}
