import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useNetwork } from 'wagmi'

import { chains } from '../config/web3Modal'
import { Params } from '../utils/router'
import { useChangeNetwork } from './useChangeNetwork'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useMultiChainStore } from './useMultiChainStore'

export const useListenNetwork = () => {
  const { chain } = useNetwork()
  const multiChainStore = useMultiChainStore()
  const currentChainStore = useCurrentBlockChain(multiChainStore.data)
  const { changeNetwork } = useChangeNetwork()
  const { chainName } = useParams<Params>()
  const location = useLocation()
  useEffect(() => {
    currentChainStore.setCurrentBlockChainByPage(chainName)
  }, [location])

  useEffect(() => {
    console.log('CHAIN CHANGED')
    console.log(chain)
    if (!chain) return
    if (chain?.id !== currentChainStore.chainId && chains.find(item => item.id === chain?.id)) changeNetwork(chain?.id)
  }, [chain])
}
