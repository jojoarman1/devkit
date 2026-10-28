import { MonitorDashboard } from '@/components/MonitorDashboard'
import { TitleBar } from '@/components/TitleBar'
import { useThemeSync } from '@/hooks/useThemeSync'

function App() {
  useThemeSync()

  return (
    // the window in tauri.conf.json is sized to this frame: (Figma 1778 × 1496 + 64 title bar) × --text-card-unit
    <div className="flex h-dvh flex-col overflow-clip text-card-unit">
      <TitleBar />
      <main className="px-[48em] py-[36em]">
        <MonitorDashboard />
      </main>
    </div>
  )
}

export default App
