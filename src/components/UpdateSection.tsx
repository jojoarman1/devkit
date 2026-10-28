import { Spinner } from '@/components/Spinner'
import { useUpdater } from '@/hooks/useUpdater'
import { cn } from '@/utils/cn.utils'

export const UpdateSection = () => {
  const { version, label, isBusy, isUpdateAvailable, run } = useUpdater()

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-[15px] text-foreground">{version ? `devkit ${version}` : 'devkit'}</span>
      <button
        type="button"
        disabled={isBusy}
        aria-busy={isBusy}
        onClick={run}
        className={cn(
          'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-button px-4 text-[14px] font-medium text-foreground transition-colors duration-150 hover:bg-button-hover disabled:opacity-60',
          isUpdateAvailable && 'bg-primary text-primary-foreground hover:bg-primary-hover',
        )}
      >
        {isBusy && <Spinner />}
        {label}
      </button>
    </div>
  )
}
