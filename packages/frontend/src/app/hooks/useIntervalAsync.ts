import { useCallback, useEffect, useRef } from 'react'

const useIntervalAsync = <R = unknown>(fn: () => Promise<R>, ms: number) => {
  const runningCount = useRef(0)
  const timeout = useRef<number>()
  const mountedRef = useRef(false)

  const next = useCallback(
    (handler: TimerHandler) => {
      if (mountedRef.current && runningCount.current === 0) {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        timeout.current = window.setTimeout(handler, ms)
      }
    },
    [ms],
  )

  const run = useCallback(async () => {
    runningCount.current += 1
    const result = await fn()
    runningCount.current -= 1

    next(run)

    return result
  }, [fn, next])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      window.clearTimeout(timeout.current)
    }
  }, [])

  const flush = useCallback(() => {
    window.clearTimeout(timeout.current)
  }, [])

  return {
    flush,
    run,
  }
}

export default useIntervalAsync
