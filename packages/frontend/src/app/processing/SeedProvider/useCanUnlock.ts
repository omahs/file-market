import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSeedProvider } from './useSeedProvider'

export function useCanUnlock(account: string | undefined): boolean {
  const [canSeedUnlock, setCanUnlock] = useState(false)
  const { seedProvider } = useSeedProvider(account)
  const updateCanUnlock = useCallback(() => {
    setCanUnlock((seedProvider?.canUnlock()) || false)
  }, [setCanUnlock, seedProvider])
  useEffect(() => {
    updateCanUnlock()
    seedProvider?.addOnInitListener(updateCanUnlock)

    return () => {
      seedProvider?.removeOnInitListener(updateCanUnlock)
    }
  }, [updateCanUnlock, seedProvider])

  const canUnlock = useMemo(() => {
    return canSeedUnlock
  }, [canSeedUnlock])

  return canUnlock
}
