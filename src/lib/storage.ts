import { useEffect, useState } from 'react'

/** useState that persists to localStorage. Falls back to in-memory state if storage is unavailable. */
export function useStoredState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private mode or storage full: keep working without persistence.
    }
  }, [key, value])

  return [value, setValue]
}
