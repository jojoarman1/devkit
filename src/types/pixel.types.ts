import type { PIXEL_CHARS } from '@/constants/pixel-glyphs.constants'

export type PixelChar = (typeof PIXEL_CHARS)[number]

export type PixelDot = [x: number, y: number]

export interface PixelGlyph {
  dots: PixelDot[]
}

export interface PixelCircle {
  x: number
  y: number
  isActive: boolean
}

export interface PixelCircleStep extends PixelCircle {
  spawnAt: PixelDot | null
}

export interface PixelSlot {
  id: number
  char: PixelChar
  x: number
}
