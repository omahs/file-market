import { useAccount } from 'wagmi'

import { useStores } from './useStores'

export const useIsConnected = () => {
  const { authStore } = useStores()
  const { isConnected } = useAccount()

  return authStore.isAuth && isConnected
}
