import { useCallback, useEffect, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import { stringifyError } from '../utils/error'
import { IStoreRequester } from '../utils/store'
import { useAuth } from './useAuth'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useMultiChainStore } from './useMultiChainStore'
import { useStores } from './useStores'

export const useChangeNetwork = (props?: { onSuccess?: (chainId?: number) => void, onError?: () => void }) => {
  const currentChainStore = useCurrentBlockChain()
  const multiChainStore = useMultiChainStore()
  const [isCanConnectAfterChange, setIsCanConnectAfterChange] = useState<boolean>(false)
  const { isConnected } = useAccount()
  const { connect, setDefaultChain } = useAuth()
  const rootStore = useStores()
  const { switchNetwork, error, isLoading } = useSwitchNetwork({
    onSuccess: (data) => {
      console.log('Success')
      rootStore.errorStore.showError('Success')
      currentChainStore.setCurrentBlockChain(data.id)
      props?.onSuccess?.(data.id)
      reloadStores()
    },
    onError: () => {
      console.log('Error')
      props?.onError?.()
    },
    onMutate: () => {
      console.log('Mutate')
      rootStore.errorStore.showError('Mutate')
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
    let iter = 0
    const interval = setInterval(() => {
      iter++
      console.log(iter)
      if (!activeStores.find((item) => item.isLoading) || iter > 3) {
        activeStores.forEach((item) => { item.reload() })
        clearInterval(interval)
      }
    }, 1000)
  }
  const { chain } = useNetwork()

  useEffect(() => {
    if (isCanConnectAfterChange) {
      connect()
      setIsCanConnectAfterChange(false)
    }
  }, [isCanConnectAfterChange])

  useEffect(() => {
    if (error) {
      rootStore.errorStore.showError(stringifyError(error !== null ? error : undefined))
    }
  }, [error])

  const changeNetwork = useCallback((chainId: number | undefined, isWarningNetwork?: boolean) => {
    rootStore.errorStore.showError('Change start')
    console.log('Change start')
    if (!isConnected) {
      if (!!multiChainStore.getChainById(chainId)?.chain) {
        setDefaultChain(multiChainStore.getChainById(chainId)?.chain)
        setIsCanConnectAfterChange(true)
      } else {
        connect()
      }

      return
    }
    // Меняем сеть, если сеть в сторе !== сети кошелька или если сеть кошелька просто не равна переданной сети
    if ((currentChainStore.chainId !== chainId || isWarningNetwork) || chain?.id !== chainId) {
      if (!switchNetwork) {
        rootStore.errorStore.showError('Wallet not supported change network')
        console.log('Wallet not supported change network')
      }
      switchNetwork?.(chainId)
      rootStore.errorStore.showError('Change network')
      console.log('Change network')
    }
    // Меняем значение в сторе, если текущая сеть кошелька !== переданной сети
    if (chain?.id === chainId) {
      currentChainStore.setCurrentBlockChain(chainId ?? 0)
      rootStore.errorStore.showError('Change store')
      console.log('Change store')
      reloadStores()
    }
  }, [currentChainStore.chainId, isConnected, chain, switchNetwork])

  return {
    changeNetwork,
    chain,
    isLoading,
    error,
  }
}
