import { useEffect } from 'react'
import { useNetwork } from 'wagmi'

import { chains } from '../config/web3Modal'
import { useChangeNetwork } from './useChangeNetwork'
import { useCurrentBlockChain } from './useCurrentBlockChain'

export const useListenNetwork = () => {
  const { chain } = useNetwork()
  const currentChainStore = useCurrentBlockChain()
  const { changeNetwork } = useChangeNetwork()

  useEffect(() => {
    console.log(chain)
    if (!chain) return
    if (chain?.id !== currentChainStore.chainId && chains.find(item => item.id === chain?.id)) changeNetwork(chain?.id)
  }, [chain])
}
