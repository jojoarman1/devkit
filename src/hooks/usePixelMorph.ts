import { PIXEL_MORPH } from '@/constants/pixel.constants'
import { PIXEL_DOT_RADIUS, PIXEL_GLYPHS } from '@/constants/pixel-glyphs.constants'
import type { PixelSlot } from '@/types/pixel.types'
import { isMotionAllowed } from '@/utils/animation.utils'
import { createIdleCircles, planMorph } from '@/utils/pixel.utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, type RefObject } from 'react'

gsap.registerPlugin(useGSAP)

export const usePixelMorph = (groupRef: RefObject<SVGGElement | null>, { char, x }: Omit<PixelSlot, 'id'>) => {
  const circlesRef = useRef(createIdleCircles())
  // the first glyph of a slot is placed instantly: no appearance animation, only morphs between values
  const isFirstRunRef = useRef(true)

  useGSAP(
    () => {
      const group = groupRef.current
      if (!group) return

      const shouldAnimate = !isFirstRunRef.current && isMotionAllowed()
      isFirstRunRef.current = false
      const tween = { ...PIXEL_MORPH, duration: shouldAnimate ? PIXEL_MORPH.duration : 0 }
      const steps = planMorph(circlesRef.current, PIXEL_GLYPHS[char].dots)
      circlesRef.current = steps.map(({ x, y, isActive }) => ({ x, y, isActive }))

      gsap.to(group, { ...tween, x })
      steps.forEach(({ spawnAt, x, y, isActive }, index) => {
        const circle = group.children[index]
        if (spawnAt) gsap.set(circle, { attr: { cx: spawnAt[0], cy: spawnAt[1], r: 0 } })
        gsap.to(circle, { ...tween, attr: { cx: x, cy: y, r: isActive ? PIXEL_DOT_RADIUS : 0 } })
      })

      // StrictMode/unmount reverts the DOM to blank circles, so the tracked state must reset too
      return () => {
        circlesRef.current = createIdleCircles()
        isFirstRunRef.current = true
      }
    },
    { dependencies: [char, x], scope: groupRef },
  )
}
