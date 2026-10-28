export const iconKeys = {
  all: ['icon'] as const,
  app: (path: string | null) => [...iconKeys.all, 'app', path] as const,
}
