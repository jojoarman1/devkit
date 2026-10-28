import { MonitorDashboard } from '@/components/MonitorDashboard'
import { TitleBar } from '@/components/TitleBar'

function App() {
  return (
    // the window in tauri.conf.json is sized to this frame: (Figma 1778 × 1496 + 64 title bar) × --text-card-unit
    <div className="flex flex-col text-card-unit">
      <TitleBar />
      <main className="p-[48em]">
        <MonitorDashboard />
      </main>
    </div>
  )
}

export default App
