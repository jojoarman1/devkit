import type { PixelDot } from '@/types/pixel.types'

// Rows go top to bottom, '#' marks a lit dot. Dots come out y-down relative to the baseline,
// with the bottom row resting on it, in the same units as the line box.
export const bitmapToDots = (rows: readonly string[], pitch: number, radius: number): PixelDot[] =>
  rows.flatMap((row, rowIndex) =>
    [...row].flatMap<PixelDot>((cell, column) =>
      cell === '#' ? [[radius + column * pitch, -(radius + (rows.length - 1 - rowIndex) * pitch)]] : [],
    ),
  )
