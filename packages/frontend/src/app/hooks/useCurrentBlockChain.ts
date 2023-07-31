import { IMultiChainConfig } from '../config/multiChainConfigType'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains open orders and status fields like isLoading, isLoaded
 */
export function useCurrentBlockChain(data?: IMultiChainConfig[]) {
  const { currentBlockChainStore } = useStores()
  useActivateDeactivateRequireParams(currentBlockChainStore, data)

  return currentBlockChainStore
}
