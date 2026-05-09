import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export const useAsync = <T,>(asyncFunction: () => Promise<T>, immediate = true) => {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = async () => {
    setStatus('pending')
    try {
      const response = await asyncFunction()
      setResult(response)
      setStatus('success')
    } catch (err) {
      setError(err as Error)
      setStatus('error')
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [])

  return { execute, status, result, error }
}
