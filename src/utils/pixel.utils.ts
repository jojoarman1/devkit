import { PIXEL_GLYPH_GAP, PIXEL_POOL_SIZE } from '@/constants/pixel.constants'
import { PIXEL_CHARS, PIXEL_DOT_RADIUS, PIXEL_GLYPHS } from '@/constants/pixel-glyphs.constants'
import type { PixelChar, PixelCircle, PixelCircleStep, PixelDot, PixelSlot } from '@/types/pixel.types'

const getDistance = ([ax, ay]: PixelDot, [bx, by]: PixelDot) => (ax - bx) ** 2 + (ay - by) ** 2

const findNearest = (dot: PixelDot, candidates: PixelDot[]) =>
  candidates.reduce<PixelDot | null>(
    (nearest, candidate) => (!nearest || getDistance(dot, candidate) < getDistance(dot, nearest) ? candidate : nearest),
    null,
  )

const isPixelChar = (char: string): char is PixelChar => (PIXEL_CHARS as readonly string[]).includes(char)

export const createIdleCircles = (): PixelCircle[] =>
  Array.from({ length: PIXEL_POOL_SIZE }, () => ({ x: 0, y: 0, isActive: false }))

const getInkBounds = (char: PixelChar) => {
  const xs = PIXEL_GLYPHS[char].dots.map(([x]) => x)
  return { left: Math.min(...xs) - PIXEL_DOT_RADIUS, right: Math.max(...xs) + PIXEL_DOT_RADIUS }
}

// Glyphs are placed ink to ink (not by advance width), so the number starts flush at x = 0
// and every pair of digits has the same visual gap.
export const layoutPixelText = (value: string) => {
  const chars = [...value].filter(isPixelChar)
  let cursor = 0

  const slots = chars.map<PixelSlot>((char, index) => {
    const { left, right } = getInkBounds(char)
    // ids count from the right, so the ones digit keeps its slot (and morphs) when the number gains a digit
    const slot = { id: chars.length - index, char, x: cursor - left }
    cursor += right - left + PIXEL_GLYPH_GAP
    return slot
  })

  return { slots, width: Math.max(cursor - PIXEL_GLYPH_GAP, 0) }
}

// Lit circles travel to the nearest new dot; surplus ones shrink into the nearest dot,
// missing ones grow out of the nearest previously lit dot.
export const planMorph = (circles: PixelCircle[], targets: PixelDot[]): PixelCircleStep[] => {
  const steps: PixelCircleStep[] = circles.map(circle => ({ ...circle, spawnAt: null }))
  const activeIndices = circles.flatMap((circle, index) => (circle.isActive ? [index] : []))
  const activeDots = activeIndices.map<PixelDot>(index => [circles[index].x, circles[index].y])

  const pairs = activeIndices
    .flatMap((circleIndex, activeIndex) =>
      targets.map((target, targetIndex) => ({
        circleIndex,
        targetIndex,
        distance: getDistance(activeDots[activeIndex], target),
      })),
    )
    .sort((a, b) => a.distance - b.distance)

  const matchedCircles = new Set<number>()
  const matchedTargets = new Set<number>()

  for (const { circleIndex, targetIndex } of pairs) {
    if (matchedCircles.has(circleIndex) || matchedTargets.has(targetIndex)) continue
    matchedCircles.add(circleIndex)
    matchedTargets.add(targetIndex)
    const [x, y] = targets[targetIndex]
    steps[circleIndex] = { x, y, isActive: true, spawnAt: null }
  }

  for (const circleIndex of activeIndices) {
    if (matchedCircles.has(circleIndex)) continue
    const { x, y } = circles[circleIndex]
    const [mergeX, mergeY] = findNearest([x, y], targets) ?? [x, y]
    steps[circleIndex] = { x: mergeX, y: mergeY, isActive: false, spawnAt: null }
  }

  const idleIndices = circles.flatMap((circle, index) => (circle.isActive ? [] : [index]))

  targets.forEach((target, targetIndex) => {
    if (matchedTargets.has(targetIndex)) return
    const circleIndex = idleIndices.pop()
    if (circleIndex === undefined) return
    steps[circleIndex] = {
      x: target[0],
      y: target[1],
      isActive: true,
      spawnAt: findNearest(target, activeDots) ?? target,
    }
  })

  return steps
}
