import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Without this, tailwind-merge reads custom `text-<size>` tokens as colors and drops them next to `text-foreground`
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['card-unit', 'metric-title', 'metric-status', 'metric-row'] }],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
