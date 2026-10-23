import { useEffect, useRef, useState } from 'react'

type AsyncState<T> = {
  status: 'loading' | 'success' | 'error'
  data: T | null
  error: Error | null
}

export function useAsync<T>(factory: () => Promise<T>, deps: readonly unknown[]) {
  const factoryRef = useRef(factory)
  factoryRef.current = factory
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: null, error: null })

  useEffect(() => {
    let active = true
    setState({ status: 'loading', data: null, error: null })
    factoryRef
      .current()
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null })
      })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error : new Error('تعذر تحميل المحتوى'),
        })
      })
    return () => {
      active = false
    }
    // The factory is stored in a ref. Callers pass explicit dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
