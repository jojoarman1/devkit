import {
  PIXEL_DOT_RADIUS,
  PIXEL_FONT_METRICS,
  PIXEL_GLYPHS,
  PIXEL_GRID_PITCH,
} from '@/constants/pixel-glyphs.constants'

const { unitsPerEm, ascent, descent } = PIXEL_FONT_METRICS

// ink-to-ink gap between glyphs: exactly one empty matrix column
export const PIXEL_GLYPH_GAP = PIXEL_GRID_PITCH * 2 - PIXEL_DOT_RADIUS * 2

// line-height equals font-size (as in Figma), so the baseline sits half the leading below the ascent
export const PIXEL_BASELINE = (unitsPerEm - (ascent - descent)) / 2 + ascent

export const PIXEL_POOL_SIZE = Math.max(...Object.values(PIXEL_GLYPHS).map(glyph => glyph.dots.length))

export const PIXEL_CIRCLE_IDS = Array.from({ length: PIXEL_POOL_SIZE }, (_, index) => index)

export const PIXEL_MORPH = {
  duration: 0.6,
  ease: 'power3.inOut',
  overwrite: 'auto',
} satisfies gsap.TweenVars
