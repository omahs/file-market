import { useCallback, useEffect, useMemo, useState } from 'react'

import { useStores } from '../../hooks'
import { useSeedProvider } from './useSeedProvider'

export function useCanUnlock(account: string | undefined): boolean {
  const [canSeedUnlock, setCanUnlock] = useState(false)
  const { authStore } = useStores()
  const { seedProvider } = useSeedProvider(account)
  const updateCanUnlock = useCallback(() => {
    setCanUnlock((seedProvider?.canUnlock() && authStore.isAuth) || false)
  }, [setCanUnlock, seedProvider, authStore.isAuth])
  useEffect(() => {
    updateCanUnlock()
    seedProvider?.addOnInitListener(updateCanUnlock)

    return () => {
      seedProvider?.removeOnInitListener(updateCanUnlock)
    }
  }, [updateCanUnlock, seedProvider])

  const canUnlock = useMemo(() => {
    return canSeedUnlock && authStore.isAuth
  }, [authStore.isAuth, canSeedUnlock])

  return canUnlock
}
