import { CARD_PRESS, CARD_RELEASE } from '@/constants/animation.constants'
import { isMotionAllowed } from '@/utils/animation.utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { PointerEvent, RefObject } from 'react'

gsap.registerPlugin(useGSAP)

export const useCardPress = (cardRef: RefObject<HTMLElement | null>) => {
  const { contextSafe } = useGSAP({ scope: cardRef })

  const press = contextSafe((event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    // Keep the original target so nested buttons still receive their click.
    const target = event.target as Element
    target.setPointerCapture(event.pointerId)
    if (isMotionAllowed()) gsap.to(cardRef.current, CARD_PRESS)
  })

  const release = contextSafe(() => {
    if (isMotionAllowed()) gsap.to(cardRef.current, CARD_RELEASE)
  })

  return {
    onPointerDown: press,
    onPointerUp: release,
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.buttons === 0) release()
    },
    onPointerCancel: release,
    onLostPointerCapture: release,
  }
}
