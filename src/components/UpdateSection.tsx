import { ScrollArea } from '@/components/ScrollArea'
import { Spinner } from '@/components/Spinner'
import { useUpdater } from '@/hooks/useUpdater'
import { cn } from '@/utils/cn.utils'

export const UpdateSection = () => {
  const { version, label, isBusy, isUpdateAvailable, newVersion, changes, run } = useUpdater()

  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-4">
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
      {changes.length > 0 && (
        <div className="mt-3 rounded-2xl bg-button px-4 py-3">
          <p className="text-[14px] text-foreground/60">What's new in {newVersion}</p>
          <ScrollArea className="mt-2 max-h-40">
            <ul className="flex list-disc flex-col gap-1.5 pl-4 marker:text-foreground/40">
              {changes.map(change => (
                <li
                  key={change}
                  className="text-[14px] text-foreground"
                >
                  {change}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
