
import { getConfigById } from '../config/mark3d'
import { useCurrentBlockChain } from './useCurrentBlockChain'

export const useConfig = () => {
  const currentBlockChainStore = useCurrentBlockChain()

  return getConfigById(currentBlockChainStore.chainId)
}
