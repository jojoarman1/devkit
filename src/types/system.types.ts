// Mirrors the payload structs in src-tauri/src/monitor/
export interface CpuStats {
  usagePercent: number
}

export interface MemoryStats {
  totalBytes: number
  usedBytes: number
}

export interface NetworkStats {
  receivedBytesPerSecond: number
  transmittedBytesPerSecond: number
}

export interface DiskStats {
  name: string
  mountPoint: string
  totalBytes: number
  availableBytes: number
  isSystem: boolean
}

export interface TemperatureStats {
  cpuCelsius: number | null
}

export interface ProcessStats {
  name: string
  cpuPercent: number
  memoryBytes: number
  exePath: string | null
}

export interface SystemStats {
  cpu: CpuStats
  memory: MemoryStats
  network: NetworkStats
  disks: DiskStats[]
  temperature: TemperatureStats
  processes: ProcessStats[]
  uptimeSeconds: number
}
