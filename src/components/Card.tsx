import { useCardPress } from '@/hooks/useCardPress'
import { cn } from '@/utils/cn.utils'
import { useRef, type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

// Inherits the dashboard's font size (1em = 1 Figma px); size it with em classes via className.
export const Card = ({ children, className }: CardProps) => {
  const cardRef = useRef<HTMLElement>(null)
  const pressHandlers = useCardPress(cardRef)

  return (
    <article
      ref={cardRef}
      className={cn(
        'flex flex-col rounded-card border border-card-stroke bg-card px-[44em] pt-[60em] inset-shadow-card select-none corner-squircle',
        className,
      )}
      {...pressHandlers}
    >
      {children}
    </article>
  )
}
