import { PIXEL_CIRCLE_IDS } from '@/constants/pixel.constants'
import { usePixelMorph } from '@/hooks/usePixelMorph'
import type { PixelSlot } from '@/types/pixel.types'
import { useRef } from 'react'

type PixelGlyphProps = Omit<PixelSlot, 'id'>

export const PixelGlyph = ({ char, x }: PixelGlyphProps) => {
  const groupRef = useRef<SVGGElement>(null)
  usePixelMorph(groupRef, { char, x })

  return (
    <g ref={groupRef}>
      {PIXEL_CIRCLE_IDS.map(id => (
        <circle
          key={id}
          r={0}
        />
      ))}
    </g>
  )
}
