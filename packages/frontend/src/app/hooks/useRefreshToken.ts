import { useEffect } from 'react'

import useLogoutAndDisconnect from './useLogoutAndDisconnect'
import { useStores } from './useStores'

export const useRefreshToken = () => {
  const { authStore } = useStores()
  const { disconnect } = useLogoutAndDisconnect()

  useEffect(() => {
    if (authStore.isHaveToken) {
      if (!authStore.isActualAccessToken) {
        if (authStore.isActualRefreshToken) {
          void authStore.refreshToken()
        } else {
          disconnect?.()
        }
      }
    } else {
      disconnect?.()
    }
  }, [authStore.isHaveToken, authStore.isActualAccessToken, authStore.isActualRefreshToken, disconnect])
}
