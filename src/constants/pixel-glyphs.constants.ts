import type { PixelChar, PixelGlyph } from '@/types/pixel.types'
import { bitmapToDots } from '@/utils/pixel-bitmap.utils'

export const PIXEL_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '.', ':', '%'] as const

// Line box of the Figma number text box (Geist Pixel, 1000 units per em), so layout matches the design
export const PIXEL_FONT_METRICS = { unitsPerEm: 1000, ascent: 1005, descent: -295 }

// 5×7 dot matrix: 7 rows span the font's cap height of 722 units (6 × 106 + 2 × 43).
// Dot diameter is ~0.8 of the pitch, so neighbours almost touch, as on the reference cards.
export const PIXEL_GRID_PITCH = 106
export const PIXEL_DOT_RADIUS = 43

// Classic 5×7 LCD shapes, matched to the reference (85, 7:45, 13, 61, 52, 86)
const PIXEL_BITMAPS: Record<PixelChar, readonly string[]> = {
  '0': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '#.#..', '..#..', '..#..', '..#..', '#####'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['.###.', '#...#', '....#', '..##.', '....#', '#...#', '.###.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  '-': ['...', '...', '...', '###', '...', '...', '...'],
  '.': ['.', '.', '.', '.', '.', '.', '#'],
  ':': ['.', '.', '#', '.', '#', '.', '.'],
  '%': ['##..#', '##.#.', '...#.', '..#..', '.#...', '.#.##', '#..##'],
}

export const PIXEL_GLYPHS = Object.fromEntries(
  Object.entries(PIXEL_BITMAPS).map(([char, rows]) => [
    char,
    { dots: bitmapToDots(rows, PIXEL_GRID_PITCH, PIXEL_DOT_RADIUS) },
  ]),
) as Record<PixelChar, PixelGlyph>
