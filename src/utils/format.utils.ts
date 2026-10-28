import { BYTE_UNITS, SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from '@/constants/system.constants'

// Picks the unit that keeps the number under 1024, with one decimal for small values ("4.2 GB", "512 MB")
export const formatBytes = (bytes: number) => {
  const unitIndex = bytes > 0 ? Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1) : 0
  const amount = bytes / 1024 ** unitIndex
  const value = unitIndex > 0 && amount < 10 ? amount.toFixed(1) : String(Math.round(amount))
  return { value, unit: BYTE_UNITS[unitIndex] }
}

const padTwo = (value: number) => String(value).padStart(2, '0')

export const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / SECONDS_PER_DAY)
  const hours = Math.floor((seconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR)
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)

  if (days === 0) return { value: `${hours}:${padTwo(minutes)}`, unit: 'h:m' }
  return { value: `${days}:${padTwo(hours)}`, unit: 'd:h' }
}
