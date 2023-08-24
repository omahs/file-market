import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains open orders and status fields like isLoading, isLoaded
 * @param accountAddress
 */
export function useCollectionsListStore() {
  const { collectionsListStore } = useStores()
  useActivateDeactivateRequireParams(collectionsListStore)

  return collectionsListStore
}
