import { CARD_PRESS, CARD_RELEASE } from '@/constants/animation.constants'
import { isMotionAllowed } from '@/utils/animation.utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP)

export const useCardPress = (cardRef: RefObject<HTMLElement | null>) => {
  const { contextSafe } = useGSAP({ scope: cardRef })

  const press = contextSafe(() => {
    if (isMotionAllowed()) gsap.to(cardRef.current, CARD_PRESS)
  })

  const release = contextSafe(() => {
    if (isMotionAllowed()) gsap.to(cardRef.current, CARD_RELEASE)
  })

  return {
    onPointerDown: press,
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
  }
}
