import { onWindowFocusChanged } from '@/api/window.api'
import { useEffect, useState } from 'react'

export const useWindowFocus = () => {
  const [isFocused, setIsFocused] = useState(() => document.hasFocus())

  useEffect(() => {
    const unlistenPromise = onWindowFocusChanged(setIsFocused)
    return () => {
      unlistenPromise.then(unlisten => unlisten())
    }
  }, [])

  return isFocused
}
