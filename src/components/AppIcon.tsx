import { useAppIcon } from '@/hooks/useAppIcon'

interface AppIconProps {
  path: string | null
}

// Protected system processes have no path; they keep the empty tile
export const AppIcon = ({ path }: AppIconProps) => {
  const { data: src } = useAppIcon(path)

  return (
    <span className="flex size-[40em] shrink-0 items-center justify-center rounded-[14em] bg-card-raised corner-squircle">
      {!!src && (
        <img
          src={src}
          alt=""
          className="size-[28em]"
        />
      )}
    </span>
  )
}
