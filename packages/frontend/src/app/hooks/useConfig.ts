
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useMultiChainStore } from './useMultiChainStore'

export const useConfig = () => {
  const currentBlockChainStore = useCurrentBlockChain()
  const multiChainStore = useMultiChainStore()

  return multiChainStore.getConfigById(currentBlockChainStore.chainId)
}
