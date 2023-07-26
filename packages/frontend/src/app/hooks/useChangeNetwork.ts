import { useCallback, useEffect, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import { chains } from '../config/web3Modal'
import { IStoreRequester } from '../utils/store'
import { useAuth } from './useAuth'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useStores } from './useStores'

export const useChangeNetwork = () => {
  const currentChainStore = useCurrentBlockChain()
  const { isConnected } = useAccount()
  const { connect } = useAuth()
  const rootStore = useStores()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { switchNetwork, error } = useSwitchNetwork({
    onSuccess: (data) => {
      currentChainStore.setCurrentBlockChain(data.id)
      setIsLoading(false)
      reloadStores()
    },
  })

  const { chain } = useNetwork()

  function isIStoreRequest(object: any): object is IStoreRequester {
    return 'reload' in object
  }

  const reloadStores = () => {
    for (const key in rootStore) {
      // eslint-disable-next-line no-prototype-builtins
      if (rootStore.hasOwnProperty(key)) {
        const value = rootStore[key as keyof typeof rootStore]
        if (isIStoreRequest(value) && value.isActivated) {
          value.reload()
        }
      }
    }
  }

  const changeNetwork = useCallback((chainId: number | undefined, isWarningNetwork?: boolean) => {
    console.log(chainId)
    if (!isConnected) connect()
    // Меняем сеть, если сеть в сторе !== сети кошелька или если сеть кошелька просто не равна переданной сети
    if ((currentChainStore.chainId !== chainId || isWarningNetwork) && chain?.id !== chainId) { setIsLoading(true); switchNetwork?.(chainId) }
    // Меняем значение в сторе, если текущая сеть кошелька !== переданной сети
    if (chain?.id === chainId) {
      reloadStores()
    }
  }, [currentChainStore.chainId, isConnected])

  useEffect(() => {
    console.log(chain)
    if (!chain) return
    if (chain?.id !== currentChainStore.chainId && chains.find(item => item.id === chain?.id)) changeNetwork(chain?.id)
  }, [chain])

  return {
    changeNetwork,
    isLoading,
    error,
  }
}
