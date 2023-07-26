import { useCallback, useEffect, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import { chains } from '../config/web3Modal'
import { useAuth } from './useAuth'
import { useCurrentBlockChain } from './useCurrentBlockChain'

export const useChangeNetwork = () => {
  const currentChainStore = useCurrentBlockChain()
  const { isConnected } = useAccount()
  const { connect } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { switchNetwork, error } = useSwitchNetwork({
    onSuccess: (data) => {
      currentChainStore.setCurrentBlockChain(data.id)
      setIsLoading(false)
    },
  })

  const { chain } = useNetwork()

  const changeNetwork = useCallback((chainId: number | undefined, isWarningNetwork?: boolean) => {
    console.log(chainId)
    if (!isConnected) connect()
    // Меняем сеть, если сеть в сторе !== сети кошелька или если сеть кошелька просто не равна переданной сети
    if ((currentChainStore.chainId !== chainId || isWarningNetwork) && chain?.id !== chainId) { setIsLoading(true); switchNetwork?.(chainId) }
    // Меняем значение в сторе, если текущая сеть кошелька !== переданной сети
    if (chain?.id === chainId) currentChainStore.setCurrentBlockChain(chainId ?? 0)
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
