import { useCallback, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import { IStoreRequester } from '../utils/store'
import { useAuth } from './useAuth'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useStores } from './useStores'

export const useChangeNetwork = (props?: { onSuccess?: (chainId?: number) => void, onError?: () => void }) => {
  const currentChainStore = useCurrentBlockChain()
  const { isConnected } = useAccount()
  const { connect } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const rootStore = useStores()
  const { switchNetwork, error } = useSwitchNetwork({
    onSuccess: (data) => {
      currentChainStore.setCurrentBlockChain(data.id)
      setIsLoading(false)
      props?.onSuccess?.(data.id)
      reloadStores()
    },
    onError: () => {
      props?.onError?.()
    },
  })

  function isIStoreRequest(object: any): object is IStoreRequester {
    return 'reload' in object
  }

  const getActiveStores = () => {
    const result = []
    for (const key in rootStore) {
      // eslint-disable-next-line no-prototype-builtins
      if (rootStore.hasOwnProperty(key)) {
        const value = rootStore[key as keyof typeof rootStore]
        // eslint-disable-next-line no-prototype-builtins
        if (isIStoreRequest(value) && value.isActivated && !value.hasOwnProperty('isCustomApi')) {
          result.push(value)
        }
      }
    }

    return result
  }

  const reloadStores = () => {
    const activeStores = getActiveStores()
    const interval = setInterval(() => {
      if (!activeStores.find((item) => item.isLoading)) {
        activeStores.forEach((item) => { item.reload() })
        clearInterval(interval)
      }
    }, 1000)
  }
  const { chain } = useNetwork()

  const changeNetwork = useCallback((chainId: number | undefined, isWarningNetwork?: boolean) => {
    if (!isConnected) connect()
    // Меняем сеть, если сеть в сторе !== сети кошелька или если сеть кошелька просто не равна переданной сети
    if ((currentChainStore.chainId !== chainId || isWarningNetwork) || chain?.id !== chainId) {
      setIsLoading(true)
      switchNetwork?.(chainId)
    }
    // Меняем значение в сторе, если текущая сеть кошелька !== переданной сети
    if (chain?.id === chainId) {
      console.log('Change')
      currentChainStore.setCurrentBlockChain(chainId ?? 0)
      reloadStores()
    }
  }, [currentChainStore.chainId, isConnected, chain])

  return {
    changeNetwork,
    chain,
    isLoading,
    error,
  }
}
