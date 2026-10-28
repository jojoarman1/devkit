import { PIXEL_BASELINE } from '@/constants/pixel.constants'
import { PIXEL_FONT_METRICS } from '@/constants/pixel-glyphs.constants'
import { layoutPixelText } from '@/utils/pixel.utils'
import { PixelGlyph } from '@/components/PixelGlyph'

interface PixelNumberProps {
  value: string
  className?: string
}

export const PixelNumber = ({ value, className }: PixelNumberProps) => {
  const { slots, width } = layoutPixelText(value)

  return (
    <svg
      viewBox={`0 0 ${width} ${PIXEL_FONT_METRICS.unitsPerEm}`}
      className={className}
      fill="currentColor"
      overflow="visible"
      // long values (e.g. uptime "10:48") get capped by max-w-full and shrink in place, left-aligned
      preserveAspectRatio="xMinYMid meet"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label={value}
    >
      <g transform={`translate(0 ${PIXEL_BASELINE})`}>
        {slots.map(slot => (
          <PixelGlyph
            key={slot.id}
            char={slot.char}
            x={slot.x}
          />
        ))}
      </g>
    </svg>
  )
}
